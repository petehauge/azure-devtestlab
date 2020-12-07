using System.Collections.Generic;

namespace SimplePortal.UI.Web.Data
{
    public abstract class BaseResponse
    {
        public StatusCodes Status { get; set; }
        public string ErrorMessage { get; set; }
    }

    public sealed class ClassroomResponse : BaseResponse
    {
        public List<Semester> Semesters { get; set; }
        public List<Department> Departments { get; set; }
        public List<CourseType> CourseTypes { get; set; }
        public List<string> Classes { get; set; }
    }

    public sealed class Semester
    {
        public int Year { get; set; }
        public string Period { get; set; }

        public string DisplayName { get { return $"{this.Year}{this.Period}".Trim(); } }
    }

    public sealed class Department
    {
        public string ShortName { get; set; }
        public string Name { get; set; }

        public string DisplayName { get { return $"{this.ShortName} - {this.Name}".Trim(); } }
    }

    public sealed class CourseType
    {
        public string ShortName { get; set; }
        public string Name { get; set; }
    }

    public sealed class AddClassroomRequest
    {
        public string Semester { get; set; }
        public string Department { get; set; }
        public string CourseType { get; set; }
        public int ClassCode { get; set; } = 100;
        public string ClassName { get; set; }
        public bool DefaultCredentials { get; set; } = true;
        public string Username { get; set; }
        public string Password { get; set; }

        public string DisplayName
        {
            get
            {
                return $"{this.Semester} {this.Department}{this.ClassCode} {this.ClassName} ({this.CourseType})".Replace("()", "").Replace("  ", "").Trim();
            }
        }

        public bool IsInvalid()
        {
            return string.IsNullOrEmpty(this.Semester)
                || string.IsNullOrEmpty(this.Department)
                || string.IsNullOrEmpty(this.ClassName);
        }
    }

    public enum StatusCodes
    {
        None,
        OK,
        Error
    }
}