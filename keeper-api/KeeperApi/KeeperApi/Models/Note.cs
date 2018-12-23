using System.Collections.Generic;
using System.Runtime.Serialization;
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

        [DataMember]
        public List<Tag> Tags { get; set; } = new List<Tag>();
    }
}