<?php
function call_vod_order()
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

        <!-- DataTable Result -->
        <div id="datatable-container">
            <div id="submit-order-wrapper" style="display:none; margin: 20px 0; text-align: right;">
                <button id="add-vod-row">＋ 新しい行を追加</button>
            </div>
            <table id="vod-order-table" class="display" style="width:100%"></table>

            <div id="submit-order-wrappers" style="text-align:right; margin-top:20px; display:none;">
                <button id="submit-order" class="submit-vod-btn">VOD順を保存</button>
            </div>
        </div>
    </div>
    <!-- Add VOD Modal -->
    <div class="modal fade" id="vodModal" tabindex="-1" aria-labelledby="vodModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered"> <!-- ← center vertically -->
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="vodModalLabel">VODを追加</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                </div>
                <div class="modal-body">
                    <label for="vod-select">VODを選択：</label>
                    <select id="vod-select" style="width: 100%"></select>
                    <div id="vod-details" class="mt-3"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                    <button type="button" id="confirm-add-vod" class="btn btn-primary">追加</button>
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

            function formatOptionWithImage(option) {
                if (!option.image) return option.text;
                return `<img src="${option.image}" style="height: 20px; width: auto; vertical-align: middle; margin-right: 5px;" /> ${option.text}`;
            }


            function formatSelectedOption(option) {
                return option.text;
            }

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
                const selectedTitle = e.params.data.text;
                const selectedImage = e.params.data.image;
                const selectedVod = e.params.data.vod; // Comma-separated IDs
                const vodIds = selectedVod.split(',');

                $.ajax({
                    type: 'POST',
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/vod_order/get_vod_order.php",
                    data: {
                        vod_ids: selectedVod
                    },
                    dataType: 'json',
                    success: function(response) {
                        let tableData = response;

                        function renderTable(data) {
                            if ($.fn.DataTable.isDataTable('#vod-order-table')) {
                                table.clear().rows.add(data).draw();
                            } else {
                                table = $('#vod-order-table').DataTable({
                                    data: data,
                                    columns: [{
                                            data: null,
                                            title: '番号',
                                            render: function(data, type, row, meta) {
                                                return meta.row + 1;
                                            }
                                        },
                                        {
                                            data: 'id',
                                            title: 'VOD ID'
                                        },
                                        {
                                            data: 'name',
                                            title: 'タイトル'
                                        },
                                        {
                                            data: 'microcopy',
                                            title: 'マイクロコピー'
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
                            $('#vod-order-table').off('click').on('click', 'button', function() {
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
                            $('#add-vod-row').off('click').on('click', function() {
                                const currentData = table.rows().data().toArray();
                                const existingIds = currentData.map(row => row.id).filter(id => id !== undefined);

                                const modal = new bootstrap.Modal(document.getElementById('vodModal'));
                                modal.show();

                                // Init Select2
                                $('#vod-select').select2({
                                    dropdownParent: $('#vodModal'),
                                    placeholder: 'VODを選択',
                                    allowClear: true,
                                    ajax: {
                                        url: "<?php echo get_template_directory_uri(); ?>/custom_function/vod_order/get_available_vods.php",
                                        type: 'POST',
                                        dataType: 'json',
                                        delay: 250,
                                        data: function() {
                                            return {
                                                exclude_ids: existingIds.join(',')
                                            };
                                        },
                                        processResults: function(data) {
                                            return {
                                                results: data.map(vod => ({
                                                    id: vod.id,
                                                    text: vod.name,
                                                    microcopy: vod.microcopy
                                                }))
                                            };
                                        },
                                        cache: true
                                    }
                                });

                                // Show details on select
                                $('#vod-select').off('select2:select').on('select2:select', function(e) {
                                    const selected = e.params.data;
                                    $('#vod-details').html(`
            <p><strong>ID:</strong> ${selected.id}</p>
            <p><strong>タイトル:</strong> ${selected.text}</p>
            <p><strong>マイクロコピー:</strong> ${selected.microcopy}</p>
        `);
                                });

                                // Clear on close
                                $('#vodModal').on('hidden.bs.modal', function() {
                                    $('#vod-select').val(null).trigger('change');
                                    $('#vod-details').html('');
                                });

                                // Add selected VOD to table
                                $('#confirm-add-vod').off('click').on('click', function() {
                                    const selected = $('#vod-select').select2('data')[0];
                                    if (!selected) return alert('VODを選択してください');

                                    const currentData = table.rows().data().toArray();
                                    currentData.push({
                                        id: selected.id,
                                        name: selected.text,
                                        microcopy: selected.microcopy
                                    });

                                    renderTable(currentData);
                                    $('#submit-order-wrapper').show();
                                    $('#submit-order-wrappers').show();
                                    modal.hide();
                                });
                            });
                        }
                        renderTable(tableData);
                        $('#submit-order-wrapper').show();
                        $('#submit-order-wrappers').show();
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
                            // Handle error response (optional)
                            alert('保存に失敗しました');
                        }
                    });
                });
            });
        });
    </script>
<?php
}
