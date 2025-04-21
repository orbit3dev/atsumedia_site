<?php
function call_cast_order()
{
?>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- jQuery & Select2 -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>


    <div class="wrap">
        <h1>記事を選択</h1>

        <!-- Select2 Dropdown -->
        <select id="article-select" style="width: 400px;"></select>

        <!-- CAST DataTable -->
        <div id="cast-table-container">
            <div id="submit-cast-wrapper" style="display:none; margin: 20px 0; text-align: right;">
                <button id="add-cast-row">＋ キャストを追加</button>
            </div>
            <table id="cast-order-table" class="display" style="width:100%"></table>

            <div id="submit-cast-button-wrapper" style="text-align:right; margin-top:20px; display:none;">
                <button id="submit-cast-order" class="submit-vod-btn">キャスト順を保存</button>
            </div>
        </div>
    </div>

    <!-- CAST Modal -->
    <div class="modal fade" id="castModal" tabindex="-1" aria-labelledby="castModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered"> <!-- ← center vertically -->
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="castModalLabel">キャストを追加</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                </div>
                <div class="modal-body">
                    <label for="cast-select">キャストを選択：</label>
                    <select id="cast-select" style="width: 100%"></select>
                    <div id="cast-details" class="mt-3"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                    <button type="button" id="confirm-add-cast" class="btn btn-primary">追加</button>
                </div>
            </div>
        </div>
    </div>



    <!-- Load JS libraries -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/custom_vod.css">

    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>

    <script>
        function formatOptionWithImage(option) {
            if (!option.image) return option.text;
            return `<img src="${option.image}" /> ${option.text}`;
        }

        function formatSelectedOption(option) {
            return option.text;
        }

        jQuery(document).ready(function($) {
            const $select = $('#article-select');

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

            $select.on('select2:select', function(e) {
                const selectedId = e.params.data.id;

                $.ajax({
                    type: 'POST',
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/cast_order/get_available_cast.php",
                    data: {
                        article_id: selectedId // or any other parameter you want to pass
                    },
                    dataType: 'json',
                    success: function(response) {
                        let tableData = response;

                        function renderTable(data) {
                            if ($.fn.DataTable.isDataTable('#cast-order-table')) {
                                table.clear().rows.add(data).draw();
                            } else {
                                table = $('#cast-order-table').DataTable({
                                    data: data,
                                    columns: [{
                                            data: null,
                                            title: '番号',
                                            render: function(data, type, row, meta) {
                                                return meta.row + 1;
                                            }
                                        },
                                        {
                                            data: 'cast_id',
                                            visible: false
                                        },
                                        {
                                            data: 'id',
                                            title: '人物ID'
                                        },
                                        {
                                            data: 'role_name',
                                            title: '役名'
                                        },
                                        {
                                            data: null,
                                            title: '並び替え',
                                            render: function() {
                                                return `
                                    <button class="move-top">⤒</button>
                                    <button class="move-up">↑</button>
                                    <button class="move-down">↓</button>
                                    <button class="move-bottom">⤓</button>
                                `;
                                            }
                                        }
                                    ],
                                    paging: false,
                                    searching: false,
                                    info: false
                                });
                            }

                            // Up/Down actions
                            $('#cast-order-table').off('click').on('click', 'button', function() {
                                const $btn = $(this);
                                const action = $btn.hasClass('move-up') ? 'move-up' :
                                    $btn.hasClass('move-down') ? 'move-down' :
                                    $btn.hasClass('move-top') ? 'move-top' :
                                    $btn.hasClass('move-bottom') ? 'move-bottom' :
                                    null;

                                const rowData = table.row($btn.closest('tr')).data();
                                let dataArr = table.rows().data().toArray();
                                const index = dataArr.findIndex(item => item.id == rowData.id); // ← this is KEY

                                if (action === 'move-up' && index > 0) {
                                    [dataArr[index - 1], dataArr[index]] = [dataArr[index], dataArr[index - 1]];
                                } else if (action === 'move-down' && index < dataArr.length - 1) {
                                    [dataArr[index + 1], dataArr[index]] = [dataArr[index], dataArr[index + 1]];
                                } else if (action === 'move-top' && index > 0) {
                                    const item = dataArr.splice(index, 1)[0];
                                    dataArr.unshift(item);
                                } else if (action === 'move-bottom' && index < dataArr.length - 1) {
                                    const item = dataArr.splice(index, 1)[0];
                                    dataArr.push(item);
                                }

                                renderTable(dataArr);
                            });


                            // Add new row button
                            $('#add-cast-row').off('click').on('click', function() {
                                const currentData = table.rows().data().toArray();
                                const existingIds = currentData.map(row => row.id).filter(id => id !== undefined);
                                const articleIds = $('#article-select').val(); // This gets the selected article_id from the Select2 dropdown
                                const modal = new bootstrap.Modal(document.getElementById('castModal'));
                                modal.show();

                                // Init Select2
                                $('#cast-select').select2({
                                    dropdownParent: $('#castModal'),
                                    placeholder: 'キャストを選択',
                                    allowClear: true,
                                    ajax: {
                                        url: "<?php echo get_template_directory_uri(); ?>/custom_function/cast_order/get_new_cast.php",
                                        type: 'POST',
                                        dataType: 'json',
                                        delay: 250,
                                        data: function(params) {
                                            return {
                                                exclude_ids: existingIds.join(','),
                                                term: params.term || '', // Search keyword
                                                page: params.page || 1 // Pagination
                                            };
                                        },
                                        processResults: function(data, params) {
                                            params.page = params.page || 1;
                                            return {
                                                results: data.results,
                                                pagination: {
                                                    more: data.pagination.more
                                                }
                                            };
                                        },
                                        cache: true
                                    }
                                });

                                // Show details on select
                                $('#cast-select').off('select2:select').on('select2:select', function(e) {
                                    const selected = e.params.data;
                                    $('#cast-details').html(`
            <p><strong>ID:</strong> ${selected.id}</p>
            <p><strong>キャスト名:</strong> ${selected.text}</p>
            <p>
        <strong>キャスト役:</strong>
        <input type="text" id="input-role-name" class="form-control" value='' style="margin-top: 5px;">
    </p>
        `);
                                });

                                // Clear on close
                                $('#vodModal').on('hidden.bs.modal', function() {
                                    $('#vod-select').val(null).trigger('change');
                                    $('#vod-details').html('');
                                });

                                // Add selected VOD to table
                                $('#confirm-add-cast').off('click').on('click', function() {
                                    const selected = $('#cast-select').select2('data')[0];
                                    if (!selected) return alert('キャストを選択してください');

                                    const customRoleName = $('#input-role-name').val() || selected.text;

                                    const currentData = table.rows().data().toArray();
                                    currentData.push({
                                        cast_id: null,
                                        id: selected.id,
                                        role_name: customRoleName,
                                        sort: selected.sort
                                    });

                                    renderTable(currentData);
                                    $('#submit-order-wrapper').show();
                                    modal.hide();
                                });
                            });
                        }
                        renderTable(tableData);
                        $('#submit-cast-wrapper').show();
                        $('#submit-cast-button-wrapper').show();
                    }

                });
                $('#submit-order').on('click', function() {
                    const ids = table.rows().data().toArray().map(row => row.id); // Extracting 'id' from each row's data
                    const idString = ids.join(','); // This creates "1,3,4,5,6,7" from an array [1, 3, 4, 5, 6, 7]
                    const articleId = $('#article-select').val(); // This gets the selected article_id from the Select2 dropdown

                    $.ajax({
                        type: 'POST',
                        url: "<?php echo get_template_directory_uri(); ?>/custom_function/vod_order/save_vod_order.php", // Update this with your actual endpoint
                        data: {
                            vod_ids: idString, // Send the formatted IDs
                            article_id: articleId // Include the article ID
                        },
                        success: function(response) {
                            alert('VOD順を保存しました');
                        },
                        error: function(error) {
                            alert('保存に失敗しました');
                        }
                    });
                });
                // Add selected cast to table


            });


            $('#add-cast-row').off('click').on('click', function() {
                const currentData = table.rows().data().toArray();
                const existingIds = currentData.map(row => row.id).filter(id => id !== undefined);
                const articleIds = $('#article-select').val(); // This gets the selected article_id from the Select2 dropdown
                const modal = new bootstrap.Modal(document.getElementById('castModal'));
                modal.show();

                // Init Select2 for cast

                // Show details of selected cast
                // Clear on close
                $('#castModal').on('hidden.bs.modal', function() {
                    $('#cast-select').val(null).trigger('change');
                    $('#cast-details').html('');
                });
            });

            $('#submit-cast-order').on('click', function() {
                const articleId = $('#article-select').val();
                if (!articleId) return alert('記事を選択してください');

                const castData = table.rows().data().toArray().map((row, index) => ({
                    sort: index + 1, // 番号
                    person_id: row.id, // キャストID
                    role_name: row.role_name, // キャスト役名
                    article_id: articleId // 記事ID
                }));

                $.ajax({
                    type: 'POST',
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/cast_order/submit_cast_order.php",
                    data: {
                        cast_order: JSON.stringify(castData)
                    },
                    dataType: 'json',
                    success: function(res) {
                        alert(res.message);
                    },
                    error: function(xhr) {
                        alert('送信エラーが発生しました');
                    }
                });
            });
        });
    </script>
<?php
}
