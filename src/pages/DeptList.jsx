
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Users, Building, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ClubList.css';

const DeptList = () => {
  const [societies, setSocieties] = useState([]);
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const response = await fetch('http://172.17.2.176:8080/intranetapp/entity-registration-summary/?entity_id=2');
      const data = await response.json();
      
      console.log(data, "DDDDD");
      setSocieties(data);
      setFilteredSocieties(data);
      
      const uniqueDepartments = [...new Set(data.map(society => society.dept_name))];
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching societies:', error);
    }
  };

  const handleSearch = () => {
    const filtered = societies.filter(society => 
      society.registration_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDepartment === '' || society.dept_name === selectedDepartment)
    );
    setFilteredSocieties(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setFilteredSocieties(societies);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    const filtered = societies.filter(society => 
      society.dept_name === e.target.value &&
      society.registration_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSocieties(filtered);
  };

  const handleJoinNow = (society) => {
    setSelectedSociety(society);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSociety(null);
  };

  const redirectJoinNow = (e) => {
    e.preventDefault();
    navigate(`/join-now`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-club">


      <main className="main-content-club">
        <div className="stats-container-club">
          <div className="stat-card-club-dept">
            <div className="stat-number-club">6000+</div>
            <div className="stat-label-club">Active members</div>
          </div>
          <div className="stat-card-club-dept ">
            <div className="stat-number-club">{filteredSocieties?.length}</div>
            <div className="stat-label-club">Departments</div>
          </div>
          <div className="stat-card-club-dept">
            <div className="stat-number-club">21</div>
            <div className="stat-label-club">Event/Activity</div>
          </div>
          <div className="stat-card-club-dept">
            <div className="stat-number-club">2</div>
            <div className="stat-label-club">Ongoing Events</div>
          </div>
        </div>

        <div className="communities-card-dept">
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Department Societies</h2>
          <p style={{ opacity: 0.9 }}>
            Discover a world of opportunities through our vibrant communities and connect with like-minded individuals
          </p>
        </div>

        <div className="search-bar">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              className="search-input"
              placeholder="Search societies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
    
          <button className="filter-button" onClick={handleSearch}>
            Search
          </button>
          <button className="filter-button" onClick={handleClearSearch}>
            Clear
          </button>
        </div>

        <div className="societies-grid">
          {filteredSocieties.map((society, index) => (
            <div key={index} className="society-card">
              <h3 className="society-name">{society.registration_name.length > 20 ? society?.registration_name?.slice(0, 20) + '...' : society?.registration_name}</h3>
              <p className="society-department">{society.dept_name.length > 34 ? society?.dept_name.slice(0, 34) + '...' : society?.dept_name}</p>
              <p className="society-code">Code: {society.registration_code}</p>
              <button className="join-button-dept" onClick={() => handleJoinNow(society)}>Read More</button>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && selectedSociety && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedSociety.registration_name}</h2>
            <p><strong>Department:</strong> {selectedSociety.dept_name}</p>
            <p><strong>Registration Code:</strong> {selectedSociety.registration_code}</p>
            <p>This is a <span style={{fontWeight:"bold", color:"green", letterSpacing:"1px"}}> {selectedSociety.registration_name} </span>. after click of join now button you will be redirected to page where you will have to fill the for to be a member of this <span style={{fontWeight:"bold", color:"green", letterSpacing:"1px"}}>{selectedSociety.registration_name}</span> with code <span style={{fontWeight:"bold", color:"green", letterSpacing:"1px"}}>{selectedSociety.registration_code}</span></p>
            <button onClick={redirectJoinNow} type="submit" className="join-button-dept">Join</button>
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeptList;