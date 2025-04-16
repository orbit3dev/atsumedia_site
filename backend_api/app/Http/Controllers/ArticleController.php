<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AtArticle;
use App\Models\AtArticleStatistic;
use App\Models\AtArticleAuthor;
use App\Models\AtArticleDirector;
use App\Models\AtArticleProducer;
use App\Models\AtArticleScreenwriter;
use App\Models\AtArticleCast;
use App\Models\AtArticleOriginalWork;
use App\Models\Network;
use App\Models\Person;
use App\Models\Vod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = AtArticle::query();

        // Optional filters based on request
        if ($request->has('genre_type_id')) {
            $query->where('genre_type_id', $request->input('genre_type_id'));
        }

        if ($request->has('parent_id')) {
            $query->where('parent_id', $request->input('parent_id'));
        }

        if ($request->has('season_id')) {
            $query->where('season_id', $request->input('season_id'));
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->has('tag_type_id')) {
            $query->where('tag_type_id', $request->input('tag_type_id'));
        }

        // Sort by 'sort' field ascending
        $query->orderBy('sort', 'asc');

        // Pagination with optional per_page param
        $perPage = $request->query('per_page', 20);
        $articles = $query->paginate($perPage);

        return response()->json($articles);
    }

    public function listBySeasonIdAndTypeSort(Request $request)
    {
        $request->validate([
            'season_id' => 'required|string',
            'genre_type_id' => 'required|integer',
            'tag_type_id' => 'required|integer',
        ]);

        $articles = AtArticle::where('at_article.season_id', $request->season_id)
            ->leftjoin('at_network', 'at_article.network_id', '=', 'at_network.id')
            ->leftjoin('at_article_genre_type', 'at_article_genre_type.id', '=', 'at_article.genre_type_id')
            ->select(
                'at_article.*',
                'at_network.name AS network_name',
                'at_article_genre_type.name AS genre_name',
            )
            ->where('at_article.genre_type_id', $request->genre_type_id)
            ->where('at_article.tag_type_id', $request->tag_type_id)
            ->orderBy('at_article.sort', 'asc')
            ->get();


        $shapedData = $articles->map(function ($article) {
            // decode thumbnail JSON if exists
            $thumbnail = json_decode($article->thumbnail, true);
            $thumbnailUrl = $thumbnail['url'] ?? null;

            // fallback for thumbnail URL if not provided
            if (!$thumbnailUrl && $article->path && $article->id) {
                // $thumbnailUrl = 'public/anime/' . $this->slugify($article->path) . '/season' . $article->season_id . '/series_thumbnail_' . $article->id . '.png';
            }

            // build the pathname

            // get network info

            return [
                'id' => (string)$article->id,
                'pathName' => $article->path_name,
                'genreType' => $article->genre_name,
                'title' => $article->program_title ?: $article->path,
                'thumbnail' => [
                    'url' => $article->thumbnail_url,
                ],
                'titleMeta' => $article->title_meta,
                'sort' => $article->sort > 0 ? $article->sort : $article->id,
                'network' => [
                    'id' => (string)($article->network_id ?? ''),
                    'name' => $article->network_name ?? ''
                ]
            ];
        });

        return response()->json($shapedData);
    }

    public function listByGenre(Request $request)
    {
        // $request->validate([
        //     'genre_type_year_week_tag_type' => 'required|string',
        // ]);
        $genreTypeYearWeek = $request->genre_type_year_week;
        $genreTypeYearWeek = '202449';
        $combinations = [
            'anime-' . $genreTypeYearWeek . '-series',
            'anime-' . $genreTypeYearWeek . '-episode',
            'anime-' . $genreTypeYearWeek . '-root',
        ];

        $stats = AtArticleStatistic::whereIn('genre_type_year_week_tag_type', $combinations)
            ->leftjoin('at_article', 'at_article.id', '=', 'at_article_statistic.article_id')
            ->leftjoin('at_network', 'at_article.network_id', '=', 'at_network.id')
            ->leftjoin('at_article_genre_type', 'at_article_genre_type.id', '=', 'at_article.genre_type_id')
            ->select(
                'at_article.*',
                'at_article_statistic.*',
                'at_network.name AS network_name',
                'at_article_genre_type.name AS genre_name',
                'at_article.id AS article_id_data',
            )
            ->orderBy('click_count', 'desc')
            ->get();
        $sql = AtArticleStatistic::whereIn('genre_type_year_week_tag_type', $combinations)
            ->leftJoin('at_article', 'at_article.id', '=', 'at_article_statistic.article_id')
            ->leftJoin('at_network', 'at_article.network_id', '=', 'at_network.id')
            ->leftJoin('at_article_genre_type', 'at_article_genre_type.id', '=', 'at_article.genre_type_id')
            ->select(
                'at_article.*',
                'at_article_statistic.*',
                'at_network.name AS network_name',
                'at_article_genre_type.name AS genre_name',
                'at_article.id AS article_id_data',
            )
            ->orderBy('click_count', 'desc')
            ->toSql();
        Log::info($sql);
        $shapedData = $stats->map(function ($article) {
            // Decode thumbnail JSON if exists
            $thumbnail = json_decode($article->thumbnail, true);
            $thumbnailUrl = $thumbnail['url'] ?? null;

            // fallback to generate URL if not present
            if (!$thumbnailUrl && $article->path_name && $article->id) {
                $thumbnailUrl = 'public/anime/' . $article->path_name . '/program_thumbnail_' . $article->article_id_data . '.png';
            }

            // You can also fetch network name if you want, or leave blank
            // $network = \App\Models\Network::find($article->network_id);

            return [
                'yearWeek'   => $article->year_week,
                'clickCount' => $article->click_count,
                'article'    => [
                    'id'            => (string)$article->id,
                    'pathName'      => $article->path_name ?? '',
                    'genreType'     => $article->genre_name ?? '',
                    'tagType'       => $article->tag ?? '',
                    'title'         => $article->program_title ?? $article->path ?? '',
                    'thumbnail'     => [
                        'url' => $thumbnailUrl,
                    ],
                    'titleMeta'       => $article->title_meta ?? '',
                    'descriptionMeta' => $article->description_meta ?? '',
                    'network'         => [
                        'id'   => (string)($article->network_id ?? ''),
                        'name' => $article->network_name ?? '',
                    ],
                ],
            ];
        });
        Log::info('shaped data');
        Log::info($shapedData);

        return response()->json($shapedData);
    }

    public function detailArticle(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        // 1. Get the parent article
        $articles = AtArticle::where('at_article.path_name', $request->path)
            ->leftJoin('at_article_genre_type', 'at_article_genre_type.id', '=', 'at_article.genre_type_id')
            ->leftJoin('at_article_tag_type', 'at_article_tag_type.id', '=', 'at_article.genre_type_id')
            ->leftJoin('at_category', 'at_category.id', '=', 'at_article.category_id')
            ->select(
                DB::raw('CAST(at_article.id AS CHAR) AS id'),
                'at_article_genre_type.name AS genreType',
                'at_article_tag_type.name AS tagType',
                'at_article.path_name AS pathName',
                'at_article.parent_id AS parentId',
                'at_article.title',
                'at_article.title_meta AS titleMeta',
                'at_article.description_meta AS descriptionMeta',
                'at_article.description_meta AS descriptionMeta',
                DB::raw('CAST(at_article.category_id AS CHAR) AS categoryId'),
                'at_article.network_id',
                'at_article.season_id AS season',
                'at_article.vod AS vod',
                'at_category.name AS category_name',
                'at_article.summary',
                'at_article.author_organization AS authorOrganiation',
                'at_article.staff',
                'at_article.sns',
                'at_article.duration_time as durationTime',
                'at_article.series_number as seriesNumber',
                'at_article.publisher',
                'at_article.other_publisher as otherPublisher',
                'at_article.website',
                'at_article.label',
                'at_article.duration_period as durationPeriod',
                'at_article.volume',
                'at_article.content_genre',
                'at_article.content_subgenre',
                'at_article.distributor',
                'at_article.distributor_overseas as distributorOverseas',
                'at_article.copyright',
                'at_article.production_year as productionYear',
                'at_article.video_text',
                'at_article.video_url',
                'at_article.created_at as createdAt',
                'at_article.updated_at as updatedAt',
                'at_article.thumbnail',
            )
            ->get();
        $articleChilds = AtArticle::where('at_article.parent_id', $articles[0]['id'])
            ->select(
                DB::raw('CAST(at_article.id AS CHAR) AS id'),
                'at_article.title',
                'at_article.title_meta AS titleMeta',
                'at_article.path_name AS pathName',
                'at_article.sort',
                'at_article.thumbnail_url',
                'at_article.thumbnail_text',
                'at_article.thumbnail_link',
            )
            ->get();
        Log::info($articleChilds);

        $articleChilds2 = Network::where('id', $articles[0]['network_id'])
            ->select('id', 'name')
            ->first();
        $str = $articles[0]['vod'];
        $intArray = array_map('intval', explode(',', $str));
        $articleChilds3 = Vod::whereIn('id', $intArray)
            ->get();
        $articleChilds4 = AtArticleAuthor::where('article_id', $articles[0]['id'])
            ->leftJoin('at_person', 'at_article_author.person_id', '=', 'at_person.id')
            ->select(
                DB::raw('CAST(at_person.id AS CHAR) AS id'),
                'at_person.name',
                'at_person.image',
                'at_person.sort',
            )
            ->get();
        $articleChilds5 = AtArticleDirector::where('article_id', $articles[0]['id'])
            ->leftJoin('at_person', 'at_article_director.person_id', '=', 'at_person.id')
            ->select(
                DB::raw('CAST(at_person.id AS CHAR) AS id'),
                'at_person.name',
                'at_person.image',
                'at_person.sort',
            )
            ->get();
        $articleChilds6 = AtArticleProducer::where('article_id', $articles[0]['id'])
            ->leftJoin('at_person', 'at_article_producer.person_id', '=', 'at_person.id')
            ->select(
                DB::raw('CAST(at_person.id AS CHAR) AS id'),
                'at_person.name',
                'at_person.image',
                'at_person.sort',
            )
            ->get();
        $articleChilds7 = AtArticleScreenwriter::where('article_id', $articles[0]['id'])
            ->leftJoin('at_person', 'at_article_screenwriter.person_id', '=', 'at_person.id')
            ->select(
                DB::raw('CAST(at_person.id AS CHAR) AS id'),
                'at_person.name',
                'at_person.image',
                'at_person.sort',
            )
            ->get();
        $articleChilds9 = AtArticleOriginalWork::where('article_id', $articles[0]['id'])
            ->leftJoin('at_person', 'at_article_original_work.person_id', '=', 'at_person.id')
            ->select(
                DB::raw('CAST(at_person.id AS CHAR) AS id'),
                'at_person.name',
                'at_person.image',
                'at_person.sort',
            )
            ->get();
        $articleChilds8 = AtArticleCast::where('article_id', $articles[0]['id'])
            ->select('at_article_cast.role_name', 'at_article_cast.person_id')
            ->get()
            ->map(function ($cast) {
                $person = Person::select('id', 'name', 'image', 'sort')
                    ->where('id', $cast->person_id)
                    ->first();

                return [
                    'roleName' => $cast->role_name,
                    'person' => [
                        'id' => $person->id,
                        'name' => $person->name,
                        'image' => $person->image ?? '',
                        'sort' => $person->sort,
                    ]
                ];
            });



        // 3. For each child, get productions and group
        $articleChilds = $articleChilds->map(function ($child) {
            // Get productions for each child
            $productions = DB::table('at_article_production')
                ->join('at_production', 'at_article_production.production_id', '=', 'at_production.id')
                ->select(
                    DB::raw('CAST(at_article_production.article_id AS CHAR) AS articleId'),
                    DB::raw('CAST(at_article_production.production_id AS CHAR) AS productionId'),
                    'at_article_production.created_at AS createdAt',
                    'at_article_production.updated_at AS updatedAt',
                    DB::raw('CAST(at_production.id AS CHAR) AS id'),
                    'at_production.name',
                    'at_production.type',
                    'at_production.sort',
                    'at_production.created_at AS productionCreatedAt',
                    'at_production.updated_at AS productionUpdatedAt'
                )
                ->where('at_article_production.article_id', $child->id)
                ->get()
                ->map(function ($prod) {
                    return [
                        'articleId' => $prod->articleId,
                        'productionId' => $prod->productionId,
                        'createdAt' => $prod->createdAt,
                        'updatedAt' => $prod->updatedAt,
                        'production' => [
                            'id' => $prod->id,
                            'name' => $prod->name,
                            'type' => $prod->type,
                            'sort' => $prod->sort,
                            'createdAt' => $prod->productionCreatedAt,
                            'updatedAt' => $prod->productionUpdatedAt,
                        ],
                    ];
                });

            $child->productions = $productions;
            $child->thumbnail = [
                'url' => $child->thumbnail_url,
                'text' => $child->thumbnail_text,
                'link' => $child->thumbnail_link,
            ]; // decode thumbnail if needed
            return $child;
        });

        // 4. Attach childs to parent and return response
        $response = $articles->map(function ($article) use (
            $articleChilds,
            $articleChilds2,
            $articleChilds3,
            $articleChilds4,
            $articleChilds5,
            $articleChilds6,
            $articleChilds7,
            $articleChilds8,
            $articleChilds9,
        ) {
            $article->childs = $articleChilds;
            $article->network = $articleChilds2;
            $article->vods = collect($articleChilds3)->map(function ($vodItem) {
                return [
                    'vod' => [
                        'id' => (string)$vodItem['id'],
                        'name' => $vodItem['name'],
                        'microcopy' => $vodItem['microcopy'],
                        'url' => $vodItem['url'],
                        'sort' => $vodItem['sort'],
                    ]
                ];
            });
            $article->authors = collect($articleChilds4)->map(function ($authorsItem) {
                return [
                    'person' => [
                        'id' => (string)$authorsItem['id'],
                        'name' => $authorsItem['name'],
                        'image' => $authorsItem['image'],
                        'sort' => $authorsItem['sort'],
                    ]
                ];
            });
            $article->directors = collect($articleChilds5)->map(function ($directorsItem) {
                return [
                    'person' => [
                        'id' => (string)$directorsItem['id'],
                        'name' => $directorsItem['name'],
                        'image' => $directorsItem['image'],
                        'sort' => $directorsItem['sort'],
                    ]
                ];
            });
            $article->producers = collect($articleChilds6)->map(function ($producersItem) {
                return [
                    'person' => [
                        'id' => (string)$producersItem['id'],
                        'name' => $producersItem['name'],
                        'image' => $producersItem['image'],
                        'sort' => $producersItem['sort'],
                    ]
                ];
            });
            $article->screenwriters = collect($articleChilds7)->map(function ($screenwritersItem) {
                return [
                    'person' => [
                        'id' => (string)$screenwritersItem['id'],
                        'name' => $screenwritersItem['name'],
                        'image' => $screenwritersItem['image'],
                        'sort' => $screenwritersItem['sort'],
                    ]
                ];
            });
            $article->articleOriginalWorks = collect($articleChilds9)->map(function ($originalworksItem) {
                return [
                    'person' => [
                        'id' => (string)$originalworksItem['id'],
                        'name' => $originalworksItem['name'],
                        'image' => $originalworksItem['image'],
                        'sort' => $originalworksItem['sort'],
                    ]
                ];
            });
            $article->category = [
                'id' => (string) $article->categoryId,
                'name' => $article->category_name,
            ];

            $article->content = [
                'genre' => (string) $article->content_genre,
                'subgenre' => $article->content_subgenre,
            ];
            unset($article->content_genre);
            unset($article->content_subgenre);
            $article->video = [
                'text' => $article->video_text,
                'url' => $article->video_url,
            ];

            $summaryData = (json_decode($article->summary, true));
            $summaryArr = (json_decode($summaryData, true));
            $article->summary = [
                'link' => $summaryArr['link'][0],
                'reference' => $summaryArr['reference'],
                'text' => $summaryArr['text'],
                'title' => $summaryArr['title'],
            ];
            // [2025-04-11 07:45:36] local.INFO: {"link":[""],"text":"（C）龍幸伸／集英社・ダンダダン製作委員会","url":"public\/anime\/dandadan\/program_thumbnail_29120.png"}  

            $thumbnailData = (json_decode($article->thumbnail, true));
            $thumbnailArr = (json_decode($thumbnailData, true));
            $article->thumbnail = [
                'link' => $thumbnailArr['link'][0],
                'text' => $thumbnailArr['text'],
                'url' => $thumbnailArr['url'],
            ];
            $article->music = []; // #temporary
            unset($article->categoryId);
            unset($article->category_name);
            $article->casts = $articleChilds8;
            $article->sns = !empty($article->sns) ? $article->sns : [];
            return $article;
        });

        return response()->json($response, 200, [], JSON_UNESCAPED_UNICODE);
    }
}
