jQuery(document).ready(function($) {
    function fetchAndRenderTable() {
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'fetch_csv_data',
                file_type: $('#file_type').val()
            },
            success: function(response) {
                if (response.data && response.columns) {
                    let tableHtml = '<table id="customDataTable" class="display nowrap" style="width:100%"><thead><tr>';
                    response.columns.forEach(col => {
                        tableHtml += `<th>${col}</th>`;
                    });
                    tableHtml += '<th>Actions</th></tr></thead><tbody>';
                    
                    response.data.forEach(row => {
                        tableHtml += '<tr>';
                        response.columns.forEach(col => {
                            tableHtml += `<td contenteditable="true">${row[col] ?? ''}</td>`;
                        });
                        tableHtml += '<td><button class="delete-row">Delete</button></td></tr>';
                    });

                    tableHtml += '</tbody></table>';
                    $(".custom-csv-wrapper").html(tableHtml);

                    $('#customDataTable').DataTable({
                        responsive: true,
                        paging: true
                    });

                    // Add delete row functionality
                    $(".delete-row").click(function() {
                        $(this).closest('tr').remove();
                    });
                }
            }
        });
    }

    // Show table when file is selected
    $("#file_type").change(function() {
        $(".custom-csv-wrapper").animate({ width: '100%' }, 500);
        fetchAndRenderTable();
        $(".custom-csv-wrapper").fadeIn(1500);
    });
});
