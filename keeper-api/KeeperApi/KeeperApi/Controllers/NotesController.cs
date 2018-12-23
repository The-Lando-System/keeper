using KeeperApi.Filters;
using KeeperApi.Models;
using KeeperApi.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace KeeperApi.Controllers
{
    [RoutePrefix("notes")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class NotesController : ApiController
    {
        private NotesRepository notesRepository = new NotesRepository();

        [Route("{id}")]
        [HttpGet]
        [AuthFilter]
        public IHttpActionResult GetNoteById(string id)
        {
            string userEmail = Request.Headers.GetValues(Constants.UserEmailHeader).FirstOrDefault();

            Note note = notesRepository.FindById(id);

            if (note == null || note.Email != userEmail)
            {
                BadRequest($"Could not find note with ID [{id}]");
            }

            return Ok(note);
        }

        [Route("")]
        [HttpGet]
        [AuthFilter]
        public IHttpActionResult GetAllNotes()
        {
            string userEmail = Request.Headers.GetValues(Constants.UserEmailHeader).FirstOrDefault();
            return Ok(notesRepository.FindAllUserNotes(userEmail));
        }

        [Route("")]
        [HttpPost]
        [AuthFilter]
        public IHttpActionResult CreateNote([FromBody] Note newNote)
        {
            string userEmail = Request.Headers.GetValues(Constants.UserEmailHeader).FirstOrDefault();

            if (string.IsNullOrEmpty(newNote.Title) && string.IsNullOrEmpty(newNote.Content))
            {
                BadRequest("Cannot create a note without a Title and Content");
            }

            newNote.Email = userEmail;

            return Ok(notesRepository.Add(newNote));
        }

        [Route("{id}")]
        [HttpDelete]
        [AuthFilter]
        public IHttpActionResult DeleteNote(string id)
        {
            string userEmail = Request.Headers.GetValues(Constants.UserEmailHeader).FirstOrDefault();
            
            if (notesRepository.FindById(id) == null)
            {
                BadRequest($"Unable to delete note. Note with ID [{id}] does not exist.");
            }

            return Ok(notesRepository.Delete(id));
        }

        [Route("")]
        [HttpPut]
        [AuthFilter]
        public IHttpActionResult EditNote([FromBody] Note editedNote)
        {
            string userEmail = Request.Headers.GetValues(Constants.UserEmailHeader).FirstOrDefault();

            if (string.IsNullOrEmpty(editedNote.Title) && string.IsNullOrEmpty(editedNote.Content))
            {
                BadRequest("Title or Content is required for a Note");
            }

            Note dbNote = notesRepository.FindById(editedNote.Id);

            if (dbNote == null)
            {
                BadRequest($"Unable to edit note. Note with ID [{editedNote.Id}] does not exist.");
            }
            
            return Ok(notesRepository.Update(editedNote.Id, editedNote));
        }

        [Route("all-tags")]
        [HttpGet]
        [AuthFilter]
        public IHttpActionResult GetAllTags()
        {
            string userEmail = Request.Headers.GetValues(Constants.UserEmailHeader).FirstOrDefault();

            List<Note> notes = notesRepository.FindAllUserNotes(userEmail).ToList();
            List<Tag> tags = new List<Tag>();
            foreach (Note note in notes)
            {
                tags.AddRange(note.Tags);
            }

            return Ok(tags.Distinct(new TagComparer()));
        }
    }
}