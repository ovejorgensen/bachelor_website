window.addEventListener('load', () => {
    const el = document.getElementById('app');
    
    let error = document.getElementById('error-template').innerHTML;
    let home = document.getElementById('home-template').innerHTML;
    let upload = document.getElementById('upload-template').innerHTML;
    let potree = document.getElementById('potree-template').innerHTML;
    // Compile Handlebar Templates
    errorTemplate = Handlebars.compile(error);
    homeTemplate = Handlebars.compile(home);
    uploadTemplate = Handlebars.compile(upload);
    potreeTemplate = Handlebars.compile(potree);

    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
            const html = errorTemplate({
                message: `The path '/${path}' does not exist on this site`,
            });
            el.innerHTML=html;
        },
    });

    router.add('/', () => {
        html = homeTemplate();
        el.innerHTML=html;
    });

    router.add('/upload', () => {
        html = uploadTemplate();
        el.innerHTML=html;
    });

    router.add('/uploaded', () => {
        potreeRoute("assets/js/uploadPage.js");

        var s2 = document.createElement("script");
        s2.type = "text/javascript";
        s2.src = "assets/js/annoCreator.js";
        document.body.appendChild(s2);

        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "assets/js/imageSorter.js";
        document.body.appendChild(s);
    });

    router.add('/sample1', () => {
        potreeRoute("assets/js/gradientScript.js");

        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "assets/js/imageSorter.js";
        document.body.appendChild(s);
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

    router.add('/sample5', () => {
        potreeRoute("assets/js/groupOne2.js");
    });
    router.add('/sample6', () => {
        potreeRoute("assets/js/flightPlanner.js");
    });
    
    function potreeRoute(source){
        let html = potreeTemplate();
        el.innerHTML=html;

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