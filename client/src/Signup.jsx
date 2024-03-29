import { useState } from "react";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import Home from "./Home";
import './home.css';
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Signup() {
    const [name, setName] = useState();
    const [email, setMail] = useState();
    const [college, setCollege] = useState();
    const [course, setCourse] = useState();
    const [branch, setBranch] = useState();
    const [currentSem, setCurrentSem] = useState();
    const [password, setPass] = useState();
    const [batchYear, setBatchYear] = useState();
    const [collegesList, setCollegesList] = useState([]);
    const [courseSelected, setCourseSelected] = useState(false);
    const [collegeSelected, setcollegeSelected] = useState(false);
    const [selectedclpr, setselectedclpr] = useState(null);
    const [branches, setBranches] = useState(null);
    const [isgoodsem, setgoodsem] = useState(false);
    const [sems, setSems] = useState(null);
    const [colleges, setColleges] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register', { name, email, college, course, branch, currentSem, password, batchYear })
            .then(result => {
                console.log(result.data.c); // Log the response data
                if (result.data.c == 1) {
                    console.log("Not Entered");
                    alert('User with same Email is already exist');
                    // You can show an alert or perform other actions here for unsuccessful data entry
                } else {
                    console.log("Entered");
                    navigate('/Signin'); // Navigate to the '/menu' route on successful data entry
                }
            })
            .catch(err => console.log(err))

        if (Object.keys(result).length === 0) {
            console.log("Not Entered")
        }
        else {
            console.log("Entered")
            navigate('/videos')
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (college && name === "course") {
            setCourse(value);
            const isCourseSelected = !!value; // Convert value to boolean
            setCourseSelected(isCourseSelected);
            console.log("hello from course change");
            const selectedCollegeObj = colleges.find(colleget => colleget.name === college);
            //console.log(selectedCollegeObj);
            if (selectedCollegeObj) {
                const selectedProgram = selectedCollegeObj.programs.find(obj => obj.course === value);
                console.log(selectedProgram);
                if (selectedProgram) {
                    setBranches(selectedProgram.branches);
                    console.log("hello branches");
                    console.log(branches);
                }
            }
        }

        if (college && course && name === "branch") {
            setBranch(value);
            const isbranchSelectedtemp = !!value; // Convert value to boolean
            setgoodsem(isbranchSelectedtemp);
            console.log("hello from branch change");
            const selectedCollegeObj = colleges.find(colleget => colleget.name === college);
            //console.log(selectedCollegeObj);
            if (selectedCollegeObj) {
                const selectedProgram = selectedCollegeObj.programs.find(obj => obj.course === course);
                console.log("hello from branch change");
                console.log(selectedProgram.total_sems);
                //console.log(selectedProgram);
                if (selectedProgram) {
                    setSems(selectedProgram.total_sems);
                }
            }
        }
    };

    const handleChangecl = (event) => {
        const { name, value } = event.target;
        console.log(value);

        //const selcollege = colleges.find((tcollege) => tcollege._id === value);
        //console.log(selcollege);
        //setFormData({ ...formData, [name]: selcollege ? selcollege.nickname : '' });
        //setFormData({ ...formData, [name]: value });
        setCollege(value);

        if (name === "college") {
            console.log("Hello from signup DD");
            const selectedCollege = value;

            const selectedCollegeObj = colleges.find(college => college.name === selectedCollege);
            console.log(selectedCollegeObj);
            if (selectedCollegeObj) {
                setselectedclpr(selectedCollegeObj.programs);
                console.log(selectedclpr);
            }
            const isclSelected = !!value; // Convert value to boolean
            setcollegeSelected(isclSelected);
        }
        // // If the selected college is found
        // if (name === 'college') {
        // }
        //console.log(formData.college);
        //setclsl(1);
    };


    const fetchColleges = () => {
        axios.post('http://localhost:3001/colleges')
            .then(response => {
                //console.log("college here");
                setColleges(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching colleges:', error);
            });
    };

    useEffect(() => {
        fetchColleges();
    }, []);



    return (
        <div>
            <header>
                <a style={{
                    fontWeight: 'bold',
                    fontSize: '40px',
                    color: 'transparent',
                    background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                    WebkitBackgroundClip: 'text', // Enable background clipping for text
                    textDecoration: 'none', // Remove underline
                    textAlign: 'center'
                }} href="/">PeerTeach</a>
                <p>
                    <a class="nav-link active" style={{ marginBottom: '-1%', marginTop: '5px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" href="/videos">Home</a>
                </p>

            </header>

            <section className="hero" >
                <form onSubmit={handleSubmit} style={{ marginTop: '-6%', marginBottom: '-1%' }}> {/*width: '1000px'*/}
                    <div className="container-fluid d-flex justify-content-center align-items-center"> {/** vh-100 */}
                        <div className="card text-black m-5" style={{ borderRadius: '25px', maxWidth: '1200px' }}> {/* height: '70%'*/}
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-10 col-lg-6 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold">Sign up</p>
                                        <div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-user me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Your Name"
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-envelope me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Your Email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setMail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    {/* <label htmlFor="college">College</label> */}
                                                    <select
                                                        id="college"
                                                        name="college"
                                                        onChange={handleChangecl}
                                                        value={college}
                                                        required
                                                    >
                                                        <option value="">Select College</option>
                                                        {colleges.map(college => (
                                                            <option key={college._id} value={college.name}>{college.name}</option>
                                                        ))}
                                                    </select>
                                                    {/* {errors.college && <div>{errors.college}</div>} */}
                                                </div>
                                                <div className="col-md-6">
                                                    {/* <label htmlFor="course">Course</label> */}
                                                    <select
                                                        id="course"
                                                        name="course"
                                                        onChange={handleChange}
                                                        value={course}
                                                        disabled={!collegeSelected}
                                                        style={collegeSelected ? {} : { filter: 'blur(2px)', pointerEvents: 'none' }}
                                                        required
                                                    >
                                                        <option value="">Select Course</option>
                                                        {selectedclpr && selectedclpr.map(program => {
                                                            return <option key={program.course} value={program.course}>{program.course}</option>;
                                                            /*console.log("Program:", program);
                                                            return program.courses.map(course => {
                                                                return <option key={course} value={course}>{course}</option>;
                                                            });*/
                                                        })}
                                                    </select>
                                                    {/* {errors.course && <div>{errors.course}</div>} */}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    {/* <label htmlFor="branch">Branch</label> */}
                                                    <select
                                                        id="branch"
                                                        name="branch"
                                                        onChange={handleChange}
                                                        value={branch}
                                                        disabled={!courseSelected || !collegeSelected} // Disable input if course is not selected
                                                        required
                                                        style={(courseSelected && collegeSelected) ? {} : { filter: 'blur(2px)', pointerEvents: 'none' }} // Apply inline styles based on courseSelected
                                                    >
                                                        <option value="">Select Branch</option>
                                                        {branches && branches.map(br => {
                                                            return <option key={br} value={br}>{br}</option>;
                                                            /*console.log("Program:", program);
                                                            return program.courses.map(course => {
                                                                return <option key={course} value={course}>{course}</option>;
                                                            });*/
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    {/* <label htmlFor="semester">Semester</label> */}
                                                    <select
                                                        id="semester"
                                                        name="semester"
                                                        onChange={(e) => setCurrentSem(e.target.value)}
                                                        value={currentSem}
                                                        disabled={!isgoodsem || !courseSelected || !collegeSelected}
                                                        required
                                                        style={(isgoodsem && courseSelected && collegeSelected) ? {} : { filter: 'blur(2px)', pointerEvents: 'none' }} // Apply inline styles based on courseSelected
                                                    >
                                                        <option value="">Select Semester</option>
                                                        {sems && Array.from({ length: sems }).map((_, index) => (
                                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                                        ))}
                                                    </select>
                                                    {/* {errors.semester && <div>{errors.semester}</div>} */}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-lock me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPass(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-calendar me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Batch Year"
                                                            type="number"
                                                            min="1990"
                                                            max="2099"
                                                            value={batchYear}
                                                            onChange={(e) => setBatchYear(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" type="submit">Register</button>
                                        <p style={{ marginBottom: '-1%' }}>
                                            Already have an account? &nbsp;<Link to="/Signin">Sign In here</Link>
                                        </p>
                                    </div>
                                    <div className="col-md-10 col-lg-6 order-1 order-lg-2 d-flex align-items-center" style={{ marginBottom: '50px' }}>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" alt="Registration" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            <footer style={{ marginTop: '-5%' }}>
                <p>&copy; 2024 PeerTeach. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Signup;
