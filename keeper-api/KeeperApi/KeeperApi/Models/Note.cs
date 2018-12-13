using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using MongoOrm;

namespace KeeperApi.Models
{
    [DataContract]
    public class Note : MongoModel
    {
        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Content { get; set; }

        [DataMember]
        public string Email { get; set; }
    }
}