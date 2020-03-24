window.addEventListener('load', () => {
    const el = $('#app');
    
    // Compile Handlebar Templates
    errorTemplate = Handlebars.compile($('#error-template').html());
    homeTemplate = Handlebars.compile($('#home-template').html());
    uploadTemplate = Handlebars.compile($('#upload-template').html());
    potreeTemplate = Handlebars.compile($('#potree-template').html());

    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
            const html = errorTemplate({
                message: `The path '/${path}' does not exist on this site`,
            });
            el.html(html); 
        },
    });

    router.add('/', () => {
        html = homeTemplate();
        el.html(html);
    });

    router.add('/upload', () => {
        html = uploadTemplate();
        el.html(html);
    });

    router.add('/sample1', () => {
        potreeRoute("assets/js/gradientScript.js");;
    });

    router.add('/sample2', () => {
        potreeRoute("assets/js/geoScript.js");
    });

    router.add('/sample3', () => {
        potreeRoute("assets/js/animationPath.js");
    });

    router.add('/sample4', () => {
        potreeRoute("assets/js/groupOne.js");
    });

    router.add('/sample5', () => {
        potreeRoute("assets/js/groupOne2.js");
    });
    
    function potreeRoute(source){
        let html = potreeTemplate();
        el.html(html);

        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "assets/js/functions.js";
        document.body.appendChild(s);
        var s2 = document.createElement("script");
        s2.type = "text/javascript";
        s2.src = source;
        document.body.appendChild(s2);
    }

    // Navigate app to current url
    router.navigateTo(window.location.pathname);

    $('a').on('click', (event) => {
        // Block browser page load
        //event.preventDefault();

        const target = $(event.target);

        // Navigate to clicked url
        const href = target.attr('href');

        if(href=="#drops") return;
        if(target.attr('class')=='navbar-brand') return;

        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
      });
  });