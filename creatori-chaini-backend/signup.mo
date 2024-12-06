// signup.mo

import HashMap "mo:base/HashMap";

// Define the structure for an artist
type Artist = {
    name: Text;
    email: Text;
    username: Text;
};

// Define the actor for managing artists' signups
actor Signup {

    // A HashMap to store the artist data, using the artist's email as the key
    let artist_db: HashMap.Text<Artist> = HashMap.Text<Artist>();

    // Function to signup an artist
    public func signup(name: Text, email: Text, username: Text) : async Text {
        // Check if the email already exists in the database
        switch (HashMap.get(artist_db, email)) {
            case (?existing_artist) {
                return "Artist with this email already exists.";
            };
            case null {
                // Create a new artist object
                let new_artist : Artist = {
                    name = name;
                    email = email;
                    username = username;
                };

                // Store the new artist in the database (HashMap)
                HashMap.put(artist_db, email, new_artist);

                return "Artist registered successfully.";
            };
        };
    };

    // Function to get an artist by their email
    public func get_artist(email: Text) : async ?Artist {
        return HashMap.get(artist_db, email);
    };
};
