using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KeeperApi.Models
{
    [DataContract]
    public class Tag
    {
        [DataMember]
        public string Name { get; set; }
    }

    public class TagComparer : IEqualityComparer<Tag>
    {
        public bool Equals(Tag t1, Tag t2)
        {
            return t1.Name == t2.Name;
        }

        public int GetHashCode(Tag obj)
        {
            return 0;
        }
    }
}