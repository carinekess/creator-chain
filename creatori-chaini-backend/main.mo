// main.mo

import HashMap "mo:base/HashMap";
import Signup "creatori-chaini-backend/signup.mo";  // Ensure the path is correct
import AddProject "creatori-chaini-backend/addproject.mo";  // Ensure the path is correct

// Define the structure for an artist (this might be redundant but kept for clarity)
type Artist = {
    name: Text;
    email: Text;
    username: Text;
};

// Define the structure for a project (this might be redundant but kept for clarity)
type Project = {
    projectId: Text;
    title: Text;
    description: Text;
    creationDate: Time.Time;
};

// Define the actor that integrates the signup and project management functionalities
actor Backend {

    // A function to register an artist
    public func register_artist(name: Text, email: Text, username: Text) : async Text {
        return await Signup.signup(name, email, username);  // Call the signup function from Signup actor
    };

    // A function to get an artist's information by email
    public func get_artist(email: Text) : async ?Artist {
        return await Signup.get_artist(email);  // Call the get_artist function from Signup actor
    };

    // A function to add a project
    public func add_project(projectId: Text, title: Text, description: Text) : async Text {
        return await AddProject.add_project(projectId, title, description);  // Call the add_project function from AddProject actor
    };

    // A function to get a project by ID
    public func get_project(projectId: Text) : async ?Project {
        return await AddProject.get_project(projectId);  // Call the get_project function from AddProject actor
    };
};
