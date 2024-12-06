import React, { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "declarations/artist_tracking_backend"; // Import the IDL
import "./index.scss";

const App = () => {
  const [artists, setArtists] = useState([]);
  const [projects, setProjects] = useState([]);
  const [artistId, setArtistId] = useState("");
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignArtistId, setAssignArtistId] = useState("");
  const [assignProjectId, setAssignProjectId] = useState("");
  const [error, setError] = useState(""); // State to handle errors
  const [success, setSuccess] = useState(""); // State to handle success messages

  const be = "http://127.0.0.1:4943";
  // const CanisterId = process.env.REACT_APP_CANISTER_ID_ARTIST_TRACKING_BACKEND;
  const backendCanisterId = process.env.CANISTER_ID_ARTIST_TRACKING_BACKEND;

  console.log(backendCanisterId);

  if (!backendCanisterId) {
    console.error("Canister ID is undefined. Check your .env file.");
  }

  useEffect(() => {
    const init = async () => {
      try {
        const agent = new HttpAgent({ host: be });

        if (process.env.NODE_ENV === "development") {
          await agent.fetchRootKey();
        }

        const artistTrackingBackend = Actor.createActor(idlFactory, {
          agent,
          canisterId: backendCanisterId, // Replace with your actual canister ID
        });

        const [artistData, projectData] = await Promise.all([
          artistTrackingBackend.getArtists(),
          artistTrackingBackend.getProjects(),
        ]);

        setArtists(artistData);
        setProjects(projectData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to fetch artists and projects. Please try again later.",
        );
      }
    };

    init();
  }, []);

  const addArtist = async () => {
    try {
      const agent = new HttpAgent({ host: be });

      if (process.env.NODE_ENV === "development") {
        await agent.fetchRootKey();
      }

      const artistTrackingBackend = Actor.createActor(idlFactory, {
        agent,
        canisterId: backendCanisterId,
      });

      await artistTrackingBackend.addArtist(artistId, name, contactInfo);
      setSuccess("Artist added successfully!");
      setArtistId("");
      setName("");
      setContactInfo(""); // Clear form after success

      // Refetch the artist list
      const updatedArtists = await artistTrackingBackend.getArtists();
      setArtists(updatedArtists);
    } catch (err) {
      console.error("Error adding artist:", err);
      setError("Failed to add artist.");
    }
  };

  const addProject = async () => {
    try {
      const agent = new HttpAgent({ host: be });

      if (process.env.NODE_ENV === "development") {
        await agent.fetchRootKey();
      }

      const artistTrackingBackend = Actor.createActor(idlFactory, {
        agent,
        canisterId: backendCanisterId,
      });

      await artistTrackingBackend.addProject(projectId, title, description);
      setSuccess("Project added successfully!");
      setProjectId("");
      setTitle("");
      setDescription(""); // Clear form after success

      // Refetch the project list
      const updatedProjects = await artistTrackingBackend.getProjects();
      setProjects(updatedProjects);
    } catch (err) {
      console.error("Error adding project:", err);
      setError("Failed to add project.");
    }
  };

  const assignProject = async () => {
    try {
      const agent = new HttpAgent({ host: be });

      if (process.env.NODE_ENV === "development") {
        await agent.fetchRootKey();
      }

      const artistTrackingBackend = Actor.createActor(idlFactory, {
        agent,
        canisterId: backendCanisterId,
      });

      await artistTrackingBackend.assignProjectToArtist(
        assignArtistId,
        assignProjectId,
      );
      setSuccess("Project assigned to artist successfully!");
      setAssignArtistId("");
      setAssignProjectId(""); // Clear form after success
    } catch (err) {
      console.error("Error assigning project:", err);
      setError("Failed to assign project.");
    }
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#28a745",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "white" }}>Artists and Projects</h1>
      </div>
      <div className="container">
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}

        {/* List Artists */}
        <div>
          <h2>Artists</h2>
          <ul>
            {artists.map((artist, index) => (
              <li key={index}>
                {artist.name} - {artist.contactInfo}
              </li>
            ))}
          </ul>
        </div>

        {/* List Projects */}
        <div>
          <h2>Projects</h2>
          <ul>
            {projects.map((project, index) => (
              <li key={index}>
                {project.title} - {project.description}
              </li>
            ))}
          </ul>
        </div>

        {/* Add Artist Form */}
        <div>
          <h2>Add Artist</h2>
          <input
            type="text"
            placeholder="Artist ID"
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Contact Info"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
          <button onClick={addArtist}>Add Artist</button>
        </div>

        {/* Add Project Form */}
        <div>
          <h2>Add Project</h2>
          <input
            type="text"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={addProject}>Add Project</button>
        </div>

        {/* Assign Project to Artist */}
        <div>
          <h2>Assign Project to Artist</h2>
          <input
            type="text"
            placeholder="Artist ID"
            value={assignArtistId}
            onChange={(e) => setAssignArtistId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Project ID"
            value={assignProjectId}
            onChange={(e) => setAssignProjectId(e.target.value)}
          />
          <button onClick={assignProject}>Assign Project</button>
        </div>
      </div>
    </div>
  );
};

export default App;
