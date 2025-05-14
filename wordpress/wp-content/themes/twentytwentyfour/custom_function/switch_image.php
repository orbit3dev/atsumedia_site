<?php
function switch_image()
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
        <div id="image-panel-wrapper" style="display: flex; gap: 20px; display:none;">
            <!-- Panel 1: Selected Image -->
            <div id="original-image-panel">
                <h3>現在の画像</h3>
                <div id="selected-image-container"></div>
            </div>

            <!-- Panel 2: Upload & Action -->
            <div id="upload-panel">
                <h3>新しい画像をアップロード</h3>
                <input type="file" id="new-image-upload" accept="image/*" style="margin-top: 10px;">
                <div id="new-image-preview" style="margin-top: 10px;"></div>
                <div id="image-action-buttons" style="display: none; margin-top: 10px;">
                    <button id="switch-image-btn">画像を差し替える</button>
                    <button id="cancel-upload-btn">キャンセル</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Load JS libraries -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/switch_image.css">

    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>

    <script>
        function formatOptionWithImage(option) {
            if (!option.image) return option.text;
            return `<img src="${option.image}" style="height: 20px; width: auto; vertical-align: middle; margin-right: 5px;" /> ${option.text}`;
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
                    cache: false,
                    data: function(params) {
                        return {
                            term: params.term || '',
                            page: params.page || 1
                        };
                    },
                    processResults: function(data, params) {
                        params.page = params.page || 1;
                        console.log(data.results)
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
            let originalImageUrl = '';
            let originalImageFilename = '';

            // $select.on('select2:select', function(e) {
            //     const selectedImage = e.params.data.image;
            //     originalImageUrl = selectedImage;
            //     originalImageFilename = selectedImage.split('/').pop();
            //     $('#image-panel-wrapper').show();

            //     $('#selected-image-container').html(
            //         `<img src="${selectedImage}" style="max-width: 200px; display: block;">`
            //     );
            // });

            $select.on('select2:select', function(e) {
                const selectedImageUrl = e.params.data.image; // full URL

                $('#selected-image-container').html(`<img src="${selectedImageUrl}" style="max-width: 200px;">`);

                // Store full image URL for backend
                $('#new-image-upload').data('original-url', selectedImageUrl);
                $('#image-panel-wrapper').show();
            });

            $('#new-image-upload').on('change', function() {
                const file = this.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#new-image-preview').html(
                        `<img src="${e.target.result}" style="max-width: 200px; display: block;">`
                    );
                    $('#image-action-buttons').show();
                };
                reader.readAsDataURL(file);
            });

            $('#cancel-upload-btn').on('click', function() {
                $('#new-image-upload').val('');
                $('#new-image-preview').empty();
                $('#image-action-buttons').hide();
            });

            $('#switch-image-btn').on('click', function() {
                // const file = $('#new-image-upload')[0].files[0];
                // console.log(originalImageFilename)
                // if (!file || !originalImageFilename) return;

                // const formData = new FormData();
                // formData.append('action', 'replace_image');
                // formData.append('original_filename', originalImageFilename);
                // formData.append('new_image', file);
                const originalUrl = $('#new-image-upload').data('original-url');
                const formData = new FormData();
                formData.append('original_url', originalUrl);
                formData.append('new_image', $('#new-image-upload')[0].files[0]);

                $.ajax({
                    // url: '/wp-content/your-custom-folder/replace_image.php',
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/switch_image/set_image_switch.php",
                    method: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        if (response.success) {
                            const cacheBustedUrl = response.new_url + '?v=' + Date.now();
                            $('#selected-image-container').html(
                                `<img src="${cacheBustedUrl}" style="max-width: 200px;">`
                            );

                            alert('画像のアップロードと置き換えに成功しました');
                            window.location.reload(); // Reload the page after alert
                        } else {
                            alert(response.message || 'Upload failed');
                        }
                    }

                });
            });
        });
    </script>
<?php
}
