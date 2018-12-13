using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using KeeperApi.Models;
using MongoOrm;

namespace KeeperApi.Repositories
{
    public class NotesRepository : MongoRepository<Note>
    {

    }
}