$(function () {
    loader.setReload(true);

    $("#success-ok").click(function (e) {
        e.preventDefault();
        $("#success-form").css("display", "none");
    });

    $(
        "#contactForm input,#contactForm textarea,#contactForm button"
    ).jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(" ") >= 0) {
                firstName = name.split(" ").slice(0, -1).join(" ");
            }
            $this = $("#sendMessageButton");
            $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
            loader.on();

            var clientHeight = $(document).scrollTop();
            $("#loader").css("margin-top", `${clientHeight}px`);

            loader.on(function () {});
            $.ajax({
                url: "https://www.fashionade.ai/api/v1/contacts",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                }),
                dataType: "json",
                cache: false,
                success: function () {
                    //clear all fields
                    $("#contactForm").trigger("reset");
                    loader.off();
                    $("#success-form").css("display", "block");
                },
                error: function (e) {
                    if (e.status === 200) {
                        //clear all fields
                        $("#contactForm").trigger("reset");
                    } else {
                        // Fail message
                        $("#success").html("<div class='alert alert-danger'>");
                        $("#success > .alert-danger")
                            .html(
                                "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
                            )
                            .append("</button>");
                        $("#success > .alert-danger").append(
                            $("<strong>").text(
                                "서버의 응답이 없습니다. 잠시후 다시 시도해주세요!"
                            )
                        );
                        $("#success > .alert-danger").append("</div>");
                    }
                    loader.off();
                    $("#success-form").css("display", "block");
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
                    }, 1000);
                },
                timeout: 20000,
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $('a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$("#name").focus(function () {
    $("#success").html("");
});
