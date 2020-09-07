module.exports = strapi => {
  return {
    initialize() {

      // if database permission does not exists on project configuration, create it on database
      Object.keys(strapi.api).forEach(contenttype => {
        if (strapi.api[contenttype].config && strapi.api[contenttype].config.routes) {
          strapi.api[contenttype].config.routes.forEach(route => {
            const parseRoute = route.handler.toLowerCase()
            const [controller, action] = parseRoute.split(".");
            route.config.policies.push(`plugins::socketio.notification`)
          })
        }
      });

    },
  };
};