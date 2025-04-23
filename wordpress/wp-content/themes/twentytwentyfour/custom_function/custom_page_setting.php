<?php
require_once "constants/constants.php";


function page_settings_config()
{
?>
    <!DOCTYPE html>
    <html lang="ja">

    <head>
        <meta charset="UTF-8">
        <title>Tabbed Interface</title>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/custom_page_settings.css">
        <!-- ✅ Add these -->
        <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    </head>

    <body>

        <div class="tabs">
            <div class="tab active" data-category="anime">アニメ</div>
            <div class="tab" data-category="movie">映画</div>
            <div class="tab" data-category="jdrama">日本ドラマ</div>
            <div class="tab" data-category="fdrama">海外ドラマ</div>
        </div>

        <!-- Table structure, shared across all tabs -->
        <div class="tab-content active" id="anime">
            <h3 id="tabTitle">アニメ</h3>
            <table id="animeTable" class="anime-table">
                <thead>
                    <tr>
                        <th>記事名</th>
                        <th>画像</th>
                        <th>ポジション</th>
                        <th>削除</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>

            <div id="addRowBtnWrapper">
                <button id="addRowBtn">＋ 行を追加</button>
            </div>
        </div>

        <!-- <div id="anime" class="tab-content active">
            <h3>アニメ</h3>
            <table id="animeTable" class="anime-table">
                <thead>
                    <tr>
                        <th>記事名</th>
                        <th>画像</th>
                        <th>ポジション</th>
                        <th>削除</th>
                    </tr>
                </thead>
                <tbody>
                    < !-- Dynamic rows go here -- >
                </tbody>
            </table>

            <div id="addRowBtnWrapper">
                <button id="addRowBtn">＋ 行を追加</button>
            </div> -->



        <div class="submit-button">
            <button id="submitDataBtn">送信</button>
        </div>

        <div class="image-modal" id="imageModal">
            <div class="image-container">
                <span class="close">&times;</span>
                <img class="modal-content" id="modalImage">
            </div>
        </div>
    </body>



    <script>
        $(document).ready(function() {
            function formatSelectedOption(option) {
                return option.text;
            }

            const baseUrl = "<?php echo get_template_directory_uri(); ?>/custom_function/page_settings/";

            const categoryApiMap = {
                anime: baseUrl + 'initial_article.php?category=anime',
                movie: baseUrl + 'initial_article.php?category=movie',
                jdrama: baseUrl + 'initial_article.php?category=jdrama',
                fdrama: baseUrl + 'initial_article.php?category=fdrama',
            };


            function createRow(selectedItem = null, category = 'anime') {
                const container = $('#anime');
                const tableBody = container.find('table tbody');

                const newRow = $('<tr>');
                const newRowIndex = tableBody.find('tr').length + 1;
                const initialLink = "<?php echo get_template_directory_uri(); ?>/assets/assets/public/anime/dummy_thumbnail.png";

                const vodId = selectedItem ? selectedItem.id : '';
                const vodName = selectedItem ? selectedItem.text : '';
                const vodImage = selectedItem ? selectedItem.image || initialLink : initialLink;

                newRow.html(`
        <td><select class="article-select" style="width: 350px;"></select></td>
        <td><img src="` + vodImage + `" class="article-image" alt="No Image" /></td>
        <td><button class="move-up">⬆</button><button class="move-down">⬇</button></td>
        <td><button class="delete-row">🗑</button></td>
    `);

                // <td><select class="article-select" style="width: 350px;"></select></td>
                //         <td><img src="` + initialLink + `" class="article-image" alt="No Image" /></td>
                //         <td><button class="move-up">⬆</button><button class="move-down">⬇</button></td>
                //         <td><button class="delete-row">🗑</button></td>

                tableBody.append(newRow);
                const $select = newRow.find('.article-select');

                $select.select2({
                    placeholder: '記事を選択',
                    ajax: {
                        url: "<?php echo get_template_directory_uri(); ?>/custom_function/page_settings/article_list.php?category=" + category,
                        dataType: 'json',
                        delay: 250,
                        data: function(params) {
                            return {
                                term: params.term || '',
                                page: params.page || 1
                            };
                        },
                        processResults: function(data, params) {
                            params.page = params.page || 1;
                            return {
                                results: data.results,
                                pagination: {
                                    more: data.more
                                }
                            };
                        },
                        cache: true
                    },
                    templateResult: formatOptionWithImage,
                    templateSelection: formatSelectedOption,
                    escapeMarkup: markup => markup
                });

                if (selectedItem) {
                    const option = new Option(selectedItem.text, selectedItem.id, true, true);
                    $select.append(option).trigger('change');
                    newRow.find('.article-image').attr('src', selectedItem.image);
                }

                $select.on('select2:select', function(e) {
                    const selected = e.params.data;
                    newRow.find('.article-image').attr('src', selected.image);
                });
            }

            function updateTableContent(category) {
                $('#tableBody').empty();
                $('#tabTitle').text(category);
            }


            $('#addRowBtn').on('click', function() {
                const activeTab = $('.tab.active');
                const category = activeTab.data('category');
                createRow(null, category);
            });

            // Fetch initial data and create rows
            let category = $('.tab.active').data('category') || 'anime';
            $.getJSON(categoryApiMap[category], function(initialItems) {
                if (Array.isArray(initialItems)) {
                    initialItems.forEach(item => {
                        createRow(item); // Pre-populate each row
                    });
                } else {
                    createRow(); // fallback empty row
                }
            }).fail(function() {
                console.error("初期データの取得に失敗しました");
                createRow(); // fallback empty row
            });

            $('.tab').on('click', function() {
                $('.tab').removeClass('active');
                $(this).addClass('active');

                const category = $(this).data('category');

                const container = $('#anime');
                const tableBody = container.find('table tbody');

                // Clear previous rows
                tableBody.empty();

                // Load initial data for the selected category
                const url = categoryApiMap[category];

                $.ajax({
                    url: url,
                    method: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        data.forEach(function(item) {
                            createRow(item, category); // Use your updated createRow
                        });
                    },
                    error: function(xhr, status, error) {
                        console.error(`Error loading data for ${category}:`, error);
                    }
                });
            });

            let rowCount = 0;
            const maxRows = 10;

            //             function createRow(selectedItem = null) {
            //                 if (rowCount >= maxRows) {
            //                     alert('最大 10 行までです。');
            //                     return;
            //                 }

            //                 const row = $(`
            //     <tr>
            //         <td><select class="article-select" style="width: 350px;"></select></td>
            //         <td><img src="` + initialLink + `" class="article-image" alt="No Image" /></td>
            //         <td><button class="move-up">⬆</button><button class="move-down">⬇</button></td>
            //         <td><button class="delete-row">🗑</button></td>
            //     </tr>
            // `);

            //                 $('#animeTable tbody').append(row);
            //                 rowCount++;

            // const $select = row.find('.article-select');

            //                 // Initialize Select2
            //                 $select.select2({
            //                     placeholder: '記事を選択',
            //                     ajax: {
            //                         url: "< ?php echo get_template_directory_uri(); ?>/custom_function/page_settings/article_list.php",
            //                         dataType: 'json',
            //                         delay: 250,
            //                         data: function(params) {
            //                             return {
            //                                 term: params.term || '',
            //                                 page: params.page || 1
            //                             };
            //                         },
            //                         processResults: function(data, params) {
            //                             params.page = params.page || 1;
            //                             return {
            //                                 results: data.results,
            //                                 pagination: {
            //                                     more: data.more
            //                                 }
            //                             };
            //                         },
            //                         cache: true
            //                     },
            //                     templateResult: formatOptionWithImage,
            //                     templateSelection: formatSelectedOption,
            //                     escapeMarkup: markup => markup
            //                 });

            //                 // Preselect if data provided
            //                 if (selectedItem) {
            //                     const option = new Option(selectedItem.text, selectedItem.id, true, true);
            //                     $select.append(option).trigger('change');
            //                     row.find('.article-image').attr('src', selectedItem.image);
            //                 }

            //                 // Change image on selection
            //                 $select.on('select2:select', function(e) {
            //                     const selected = e.params.data;
            //                     row.find('.article-image').attr('src', selected.image);
            //                 });
            //             }


            // For dropdown options
            function formatOptionWithImage(option) {
                if (!option.id) return option.text;

                return $(`
        <div style="display: flex; align-items: center;">
            <img src="${option.image}" style="width: 30px; height: 30px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
            <span>${option.text}</span>
        </div>
    `);
            }

            // For selected item display
            function formatSelectedOption(option) {
                if (!option.id) return option.text;
                return option.text;
            }

            // // Add new row
            // $('#addRowBtn').on('click', createRow);

            // Delete row
            $('#animeTable').on('click', '.delete-row', function() {
                $(this).closest('tr').remove();
                rowCount--;
            });

            // Move up
            $('#animeTable').on('click', '.move-up', function() {
                const row = $(this).closest('tr');
                row.prev().before(row);
            });

            // Move down
            $('#animeTable').on('click', '.move-down', function() {
                const row = $(this).closest('tr');
                row.next().after(row);
            });

            // Image click handler for popup
            $(document).on('click', '.article-image', function() {
                const imageUrl = $(this).attr('src');
                $('#modalImage').attr('src', imageUrl);
                $('#imageModal').fadeIn();
            });

            // Close modal when clicking on the "X"
            $('.close').click(function() {
                $('#imageModal').fadeOut();
            });

            // Also close modal when clicking outside the image
            $('#imageModal').click(function(e) {
                if (e.target.id === 'imageModal') {
                    $('#imageModal').fadeOut();
                }
            });

            $('#submitDataBtn').click(function() {
                const postData = [];

                $('#animeTable tbody tr').each(function() {
                    const articleId = $(this).find('.article-select').val();
                    console.log($(this).find('.article-select'))
                    if (articleId) {
                        postData.push(articleId);
                    }
                });

                if (postData.length === 0) {
                    alert('少なくとも1つの記事を選択してください。');
                    return;
                }

                $.ajax({
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/page_settings/save_selected_articles.php",
                    method: "POST",
                    data: {
                        articles: postData
                    },
                    success: function(response) {
                        console.log(response)
                        alert("データが保存されました！");
                    },
                    error: function(xhr, status, error) {
                        console.error("保存失敗:", error);
                        alert("データの保存に失敗しました。");
                    }
                });
            });



        });
    </script>


    </html>
<?php
}
