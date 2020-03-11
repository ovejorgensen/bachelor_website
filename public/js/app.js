window.addEventListener('load', () => {
    const el = $('#app');
    let scriptbool = false;
    
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
        let html = potreeTemplate();
        el.html(html);
        $("body").append('<script src="assets/js/functions.js"></script>');
        if(!scriptbool){
           $("body").append('<script id="gradientScript" src="potree/libs/gradientScript.js"></script>');
           scriptbool = true;
        }
    });

    router.add('/sample2', () => {
        let html = potreeTemplate();
        el.html(html);
    });

    router.add('/sample3', () => {
        let html = potreeTemplate();
        el.html(html);
    });

    // Navigate app to current url
    router.navigateTo(window.location.pathname);

    $('a').on('click', (event) => {
        // Block browser page load
        //event.preventDefault();

        const target = $(event.target);

        // Navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
      });
  });