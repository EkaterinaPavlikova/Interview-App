using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace jsFirstTask.Models
{
   
    public class QuestionEntity
    {

        public int Id { get; set; }

        public string Text { get; set; }
        public string Options { get; set; }
        public string Answers { get; set; }
        public int? Timeout { get; set; }       
    }
}
