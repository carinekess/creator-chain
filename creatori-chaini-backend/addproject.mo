// addproject.mo

import HashMap "mo:base/HashMap";
import Time "mo:base/Time";

// Define the structure for a project
type Project = {
    projectId: Text;
    title: Text;
    description: Text;
    creationDate: Time.Time;
};

// Define the actor for managing projects
actor AddProject {

    // A HashMap to store the project data, using the project ID as the key
    let project_db: HashMap.Text<Project> = HashMap.Text<Project>();

    // Function to add a new project
    public func add_project(projectId: Text, title: Text, description: Text) : async Text {
        // Create a new project object
        let new_project : Project = {
            projectId = projectId;
            title = title;
            description = description;
            creationDate = Time.now();
        };

        // Store the new project in the database (HashMap)
        HashMap.put(project_db, projectId, new_project);

        return "Project added successfully.";
    };

    // Function to get a project by its ID
    public func get_project(projectId: Text) : async ?Project {
        return HashMap.get(project_db, projectId);
    };
};
