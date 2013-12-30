var Tumblr = Tumblr || {};

    Tumblr.RecentPosts = function (el, postsCount) {
        var apiUrl = "http://" + "benahm.tumblr.com" + "/api/read/json?callback=?&filter=text&num=" + (postsCount || 5);

        var titleTypes = {
            regular: "regular-title",
            link: "link-text",
            quote: "quote-source",
            photo: "photo-caption",
            conversation: "conversation-title",
            video: "video-caption",
            audio: "audio-caption",
            answer: "question"
        };
        var monthNames = [ "Jan", "Fev", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];

        var renderPosts = function (posts) {
            return $.map($.map(posts, postInfo), renderPost);
        };

        var renderPost = function (post) {
            var date=new Date(post.date);
            return  "<div class='media media-blog'>"+
                    "<div class='event event-lg pull-left'>" +
                    "<span class='month'>"+monthNames[date.getMonth()]+"</span>" +
                    "<span class='day'>"+(date.getDay()+1)+"</span>" +
                    "<span class='year'>"+date.getYear()+"</span>" +
                    "</div>" +
                    "<h4><a href='"+post.url+"'>"+post.title+"</a></h4>"+
                    "</div>";
        };

        var postInfo = function (post) {
            var titleType = titleTypes[post.type];
            if (titleType in post) {
                return {
                    title: post[titleType],
                    url: post["url-with-slug"],
                    date:post["date"]
                };
            }
        };

        return {
            render: function () {
                var loadingEl = $("<div>").text("Loading...").appendTo($(el));
                $.getJSON(apiUrl, function (data) {
                    loadingEl.remove();
                    $("<div>").appendTo($(el)).hide().append(renderPosts(data.posts).join("\n")).slideDown('slow');
                });

                return this;
            }
        }
    };