using KeeperApi.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace KeeperApi.Controllers
{
    [RoutePrefix("values")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ValuesController : ApiController
    {
        [Route("auth")]
        [HttpGet]
        [AuthFilter]
        public IHttpActionResult GetAuthEndpoint()
        {
            string userEmail = Request.Headers.GetValues(Constants.UserEmailHeader).FirstOrDefault();

            return Ok(userEmail);
        }

        [Route("no-auth")]
        [HttpGet]
        public IHttpActionResult GetNoAuthEndpoint()
        {
            return Ok("No auth endpoint success");
        }

    }
}
