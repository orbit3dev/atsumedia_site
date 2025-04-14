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
            <div class="tab active" data-target="#anime">アニメ</div>
            <div class="tab" data-target="#movie">映画</div>
            <div class="tab" data-target="#jdrama">日本ドラマ</div>
            <div class="tab" data-target="#fdrama">海外ドラマ</div>
        </div>

        <div id="anime" class="tab-content active">
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
                    <!-- Dynamic rows go here -->
                </tbody>
            </table>

            <div id="addRowBtnWrapper">
                <button id="addRowBtn">＋ 行を追加</button>
            </div>


        </div>

        <div id="movie" class="tab-content">
            <h3>映画</h3>
            <p>ここは映画のコンテンツです。</p>
        </div>

        <div id="jdrama" class="tab-content">
            <h3>日本ドラマ</h3>
            <p>ここは日本ドラマのコンテンツです。</p>
        </div>

        <div id="fdrama" class="tab-content">
            <h3>海外ドラマ</h3>
            <p>ここは海外ドラマのコンテンツです。</p>
        </div>

        <div class="submit-button">
            <button id="submitDataBtn">送信</button>
        </div>
        <div class="image-modal" id="imageModal">
            <div class="image-container">
                <span class="close">&times;</span>
                <img class="modal-content" id="modalImage">
            </div>
        </div>


        <script>
            $(document).ready(function() {
                const initialLink = ' <?php echo get_template_directory_uri(); ?> /assets/assets/public/anime/dummy_thumbnail.png';
                const initialDataUrl = "<?php echo get_template_directory_uri(); ?>/custom_function/page_settings/initial_article.php";
                // Fetch initial data and create rows
                $.getJSON(initialDataUrl, function(initialItems) {
                    if (Array.isArray(initialItems)) {
                        initialItems.forEach(item => {
                            console.log('item')
                            console.log(item)
                            createRow(item); // Pre-populate each row
                        });
                    } else {
                        createRow(); // fallback empty row
                    }
                }).fail(function() {
                    console.error("初期データの取得に失敗しました");
                    createRow(); // fallback empty row
                });

                $('.tab').click(function() {
                    // Change active tab style
                    $('.tab').removeClass('active');
                    $(this).addClass('active');

                    // Show corresponding tab content
                    var target = $(this).data('target');
                    $('.tab-content').removeClass('active');
                    $(target).addClass('active');
                });
                let rowCount = 0;
                const maxRows = 10;

                function createRow(selectedItem = null) {
                    if (rowCount >= maxRows) {
                        alert('最大 10 行までです。');
                        return;
                    }

                    const row = $(`
        <tr>
            <td><select class="article-select" style="width: 350px;"></select></td>
            <td><img src="` + initialLink + `" class="article-image" alt="No Image" /></td>
            <td><button class="move-up">⬆</button><button class="move-down">⬇</button></td>
            <td><button class="delete-row">🗑</button></td>
        </tr>
    `);

                    $('#animeTable tbody').append(row);
                    rowCount++;

                    const $select = row.find('.article-select');

                    // Initialize Select2
                    $select.select2({
                        placeholder: '記事を選択',
                        ajax: {
                            url: "<?php echo get_template_directory_uri(); ?>/custom_function/page_settings/article_list.php",
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

                    // Preselect if data provided
                    if (selectedItem) {
                        const option = new Option(selectedItem.text, selectedItem.id, true, true);
                        $select.append(option).trigger('change');
                        row.find('.article-image').attr('src', selectedItem.image);
                    }

                    // Change image on selection
                    $select.on('select2:select', function(e) {
                        const selected = e.params.data;
                        row.find('.article-image').attr('src', selected.image);
                    });
                }


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

                // Add new row
                $('#addRowBtn').on('click', createRow);

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

    </body>

    </html>
<?php
}
