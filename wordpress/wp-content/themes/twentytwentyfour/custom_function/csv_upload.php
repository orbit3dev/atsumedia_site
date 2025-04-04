<?php
require_once "constants/constants.php";


function custom_csv_upload_page()
{
?>
    <div class="wrap">
        <h1 style="text-align: center;">Upload CSV File</h1>
        <div class="custom-csv-wrapper">
            <form id="csvUploadForm" method="post" enctype="multipart/form-data">
                <label for="file_type"><strong>ファイルの種類を選択:</strong></label>
                <select name="file_type" id="file_type" required>
                    <option value="" disabled selected>選択してください</option>
                    <option value="article">記事</option>
                    <option value="category">カテゴリ</option>
                    <option value="season_master">シーズン</option>
                    <option value="broadcast_master">放送局</option>
                    <option value="cast_master">キャストマスタ</option>
                    <option value="vod">VOD</option>
                    <option value="song">曲</option>
                    <option value="page_settings">ページ表示設定</option>
                    <option value="production">制作会社</option>
                    <!-- <option value="news">ニュース</option> -->
                </select>
                </br>
                <input type="file" class="csv_button" name="csv_file" id="csv_file" accept=".csv" required>

                <!-- New "Add New Row" button -->
                <button type="button" id="addNewRowButton" style="display: none;">Add New Row</button>
            </form>

            <!-- DataTable will be inserted here -->
            <div id="csvDataTableWrapper" class="custom-csv-wrapper" style="display: none;"></div>
        </div>
    </div>


    <script>
        jQuery(document).ready(function($) {
            var table;

            $('#csv_file').change(function() {
                if (!$('#file_type').val()) {
                    alert('ファイルタイプを選択してください。');
                    $('#csv_file').val('');
                    return;
                }
                processCSV(false);
            });

            $('#file_type').change(function() {
                if ($(this).val() && $(this).val() !== 'article') {
                    $('#addNewRowButton').show();
                } else {
                    $('#addNewRowButton').hide();
                }
            });

            $('#addNewRowButton').click(function() {
                $('#csv_file').val('');
                processCSV(true);
            });

            function processCSV(manualEntry) {
                var formData = new FormData();

                // Reset table before loading new data
                $('#csvDataTableWrapper').empty().hide();

                if (!manualEntry) {
                    var file = $('#csv_file')[0].files[0];
                    if (!file) {
                        alert('CSVファイルを選択してください。');
                        return;
                    }
                    formData.append('csv_file', file);
                }

                formData.append('file_type', $('#file_type').val());
                formData.append('manual_entry', manualEntry ? 'true' : 'false');

                $.ajax({
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/ajax/process_csv.php",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function() {
                        $('#csvDataTableWrapper').html('<p>Loading...</p>').fadeIn();
                    },
                    success: function(response) {
                        $('#csvDataTableWrapper').empty(); // clear Loading
                        if (response.error) {
                            $('#csvDataTableWrapper').html('<p class="error">' + response.error + '</p>').fadeIn();
                        } else if (response.type === 'article') {
                            var html = '<button id="uploadCSV">CSVをアップロード</button><br><br>';
                            $('#csvDataTableWrapper').html(html).fadeIn(500);
                            $('#addNewRowButton').hide();
                            $('#uploadCSV').click(function() {
                                $.ajax({
                                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/process_csv/csv_insert_data.php",
                                    type: "POST",
                                    data: {
                                        file_path: response.file_path,
                                        file_type: 'article',
                                        tableData: null,
                                    },
                                    success: function() {
                                        alert('記事データのアップロードが完了しました');
                                        $('#csvDataTableWrapper').fadeOut(500, function() {
                                            $('#csvDataTableWrapper').empty();
                                            $('#csv_file').val('');
                                            $('#file_type').val('');
                                        });
                                    }
                                });
                            });
                        } else {
                            // Existing logic for other file types (editable table + add new row)
                            var tableHtml = '<button id="uploadCSV">CSVをアップロード</button><br><br>';
                            tableHtml += '<table id="csvDataTable" class="display" width="100%"><thead><tr>';
                            response.columns_jp.forEach(function(columns_jp) {
                                tableHtml += '<th>' + columns_jp + '</th>';
                            });

                            tableHtml += '<th>操作</th></tr></thead><tbody>';
                            response.data.forEach(function(row) {
                                tableHtml += '<tr>';
                                response.columns.forEach(function(column) {
                                    tableHtml += '<td contenteditable="false">' + row[column] + '</td>';
                                });

                                tableHtml += '<td>' +
                                    '<button class="edit-row">編集</button> ' +
                                    '<button class="delete-row">削除</button>' +
                                    '</td>';
                                tableHtml += '</tr>';
                            });

                            tableHtml += '</tbody></table>';
                            tableHtml += '<button id="addRow">新しい行を追加</button>';
                            $('#csvDataTableWrapper').html(tableHtml).fadeIn(500);

                            table = $('#csvDataTable').DataTable({
                                paging: true,
                                searching: true,
                                ordering: true,
                                responsive: true,
                                lengthMenu: [
                                    [10, 25, 50, -1],
                                    [10, 25, 50, "All"]
                                ]
                            });

                            // Add row / edit / delete logic remains the same
                            $('#addRow').click(function() {
                                var newRow = table.row.add([...Array(response.columns.length).fill(''), '<button class="edit-row">編集</button> <button class="delete-row">削除</button>']).draw().node();
                                $(newRow).find('td').attr('contenteditable', 'true');
                            });

                            $('#csvDataTableWrapper').on('click', '.edit-row', function() {
                                var row = $(this).closest('tr');
                                row.find('td').not(':last').attr('contenteditable', 'true').addClass('editing');
                                $(this).text('保存').removeClass('edit-row').addClass('save-row');
                            });

                            $('#csvDataTableWrapper').on('click', '.save-row', function() {
                                var row = $(this).closest('tr');
                                row.find('td').not(':last').attr('contenteditable', 'false').removeClass('editing');
                                $(this).text('編集').removeClass('save-row').addClass('edit-row');
                            });

                            $('#csvDataTableWrapper').on('click', '.delete-row', function() {
                                table.row($(this).closest('tr')).remove().draw();
                            });

                            $('#uploadCSV').click(function() {
                                var tableData = [];
                                table.rows().every(function() {
                                    var row = this.data();
                                    var rowData = {};
                                    response.columns.forEach((col, index) => {
                                        rowData[col] = $(this.node()).find('td:eq(' + index + ')').text();
                                    });
                                    tableData.push(rowData);
                                });
                                $.ajax({
                                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/process_csv/csv_insert_data.php",
                                    type: "POST",
                                    data: {
                                        tableData: JSON.stringify(tableData),
                                        file_type: $('#file_type').val()
                                    },
                                    success: function(uploadResponse) {
                                        alert('データのアップロードに成功しました');
                                        $('#csvDataTableWrapper').fadeOut(1000, function() {
                                            if ($.fn.DataTable.isDataTable('#csvDataTable')) {
                                                table.destroy();
                                            }
                                            $('#csvDataTableWrapper').empty();
                                            $('#csv_file').val('');
                                            $('#file_type').val('');
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            }
        });
    </script>


<?php
}


function custom_process_csv_function($file_path, $file_type)
{
    if (!file_exists($file_path)) {
        error_log("ERROR: CSV file not found at path: " . $file_path);
        return ['error' => 'CSV file not found.'];
    }

    $data = [];
    $columns = $columns_jp = [];
    if (!empty($file_type)) {
        if ($file_type === "season_master") {
            require_once get_template_directory() . "/custom_function/process_csv/season_csv.php";
            $result = process_season_csv($file_path);
            $columns = Constants::SEASON_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::SEASON_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "article") {
            require_once get_template_directory() . "/custom_function/process_csv/main_csv.php";
            // $result = process_season_csv($file_path);
        }
        if ($file_type === "broadcast_master") {
            require_once get_template_directory() . "/custom_function/process_csv/network_csv.php";
            $result = process_network_csv($file_path);
            $columns = Constants::BROADCAST_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::BROADCAST_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "cast_master") {
            require_once get_template_directory() . "/custom_function/process_csv/person_csv.php";
            $result = process_person_csv($file_path);
            $columns = Constants::PERSON_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::PERSON_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "vod") {
            require_once get_template_directory() . "/custom_function/process_csv/vod_csv.php";
            $result = process_vod_csv($file_path);
            $columns = Constants::VOD_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::VOD_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "song") {
            require_once get_template_directory() . "/custom_function/process_csv/vod_csv.php";
            $result = process_vod_csv($file_path);
            $columns = Constants::VOD_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::VOD_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "page_settings") {
            require_once get_template_directory() . "/custom_function/process_csv/page_setting_csv.php";
            $result = process_page_setting_csv($file_path);
            $columns = Constants::PAGE_SETTINGS_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::PAGE_SETTINGS_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "production") {
            require_once get_template_directory() . "/custom_function/process_csv/production_csv.php";
            $result = process_production_csv($file_path);
            $columns = Constants::PRODUCTION_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::PRODUCTION_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "category") {
            require_once get_template_directory() . "/custom_function/process_csv/category_csv.php";
            $result = process_category_csv($file_path);
            $columns = Constants::CATEGORY_COLUMNS; // Ensure proper column mapping
            $columns_jp = Constants::CATEGORY_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($file_type === "article") {
            // require_once get_template_directory() . "/custom_function/process_csv/main_csv.php";
            // $result = process_article_csv($file_path);
            // $columns = Constants::ARTICLE_COLUMNS; // Ensure proper column mapping
            // $columns_jp = Constants::ARTICLE_COLUMNS_JP; // Ensure proper column mapping
        }
        if ($result && isset($result["data"])) {
            $data = $result["data"];
        }
        $type = ($file_type =='article') ? 'article' : '';
        return [
            'data' => $data,
            'columns' => $columns,
            'columns_jp' => $columns_jp,
            'message' => '<div class="updated"><p>Processed ' . count($data) . ' rows.</p></div>',
            'type' => $type,
            'file_path' => $file_path
        ];
    } else {
        if (($handle = fopen($file_path, "r")) !== FALSE) {
            $first_row = true;
            while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if ($first_row) {
                    $columns = $row; // First row contains column names
                    $first_row = false;
                } else {
                    $data[] = array_combine($columns, $row); // Map values to columns
                }
            }
            fclose($handle);
        }
    }

    return compact('data', 'columns');
}


?>