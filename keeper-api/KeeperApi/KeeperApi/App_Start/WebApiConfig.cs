using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace KeeperApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.EnableCors();
            config.MapHttpAttributeRoutes();
        }
    }
}
