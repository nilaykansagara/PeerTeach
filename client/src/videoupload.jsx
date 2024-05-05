import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import {Toaster, toast} from "react-hot-toast";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useState,  } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const VideoUploadForm = () => {
    const navigate = useNavigate();
    let user = localStorage.getItem('userData');
    const userData = JSON.parse(user);
    const [formData, setFormData] = useState({
        title: '',
        college: '',
        course: '',
        branch: '',
        semester: '',
        subject: '',
        email: '',
        name: '',
        batch: '',
        otherDetails: '',
        video: null,
        notes: '',
        lickec: 0,
        dislikec: 0,
    });
    const [errors, setErrors] = useState({});
    const [verified, setVerified] = useState(null);
    const [colleges, setColleges] = useState([]);
    const [clslflag, setclsl] = useState(null);
    const [courseSelected, setCourseSelected] = useState(false);
    const [collegeSelected, setcollegeSelected] = useState(false);
    const [selectedclpr, setselectedclpr] = useState(null);
    const [branches, setBranches] = useState(null);
    const [isgoodsem, setgoodsem] = useState(false);
    const [sems, setSems] = useState(null);



    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        if (formData.college && name === "course") {

            const isCourseSelected = !!value; // Convert value to boolean
            setCourseSelected(isCourseSelected);
            console.log("hello from course change");
            const selectedCollegeObj = colleges.find(college => college.nickname === formData.college);
            //console.log(selectedCollegeObj);
            if (selectedCollegeObj) {
                const selectedProgram = selectedCollegeObj.programs.find(obj => obj.course === value);
                console.log(selectedProgram);
                if (selectedProgram) {
                    setBranches(selectedProgram.branches);
                }
            }
        }

        if (formData.college && formData.course && name === "branch") {

            const isbranchSelectedtemp = !!value; // Convert value to boolean
            setgoodsem(isbranchSelectedtemp);
            console.log("hello from branch change");
            const selectedCollegeObj = colleges.find(college => college.nickname === formData.college);
            //console.log(selectedCollegeObj);
            if (selectedCollegeObj) {
                const selectedProgram = selectedCollegeObj.programs.find(obj => obj.course === formData.course);
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
        setFormData({ ...formData, [name]: value });
        if (name === "college") {
            const selectedCollege = value;
            const selectedCollegeObj = colleges.find(college => college.nickname === selectedCollege);
            if (selectedCollegeObj) {
                setselectedclpr(selectedCollegeObj.programs);
                //console.log(selectedclpr.programs);
            }
            const isclSelected = !!value; // Convert value to boolean
            setcollegeSelected(isclSelected);
        }
        // // If the selected college is found
        // if (name === 'college') {
        // }
        //console.log(formData.college);
        setclsl(1);
    };



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData({ ...formData, video: file });
        setVerified(0);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        /*
        if (!formData.otherDetails) newErrors.otherDetails = 'Description is required';
        if (!formData.college) newErrors.college = 'College is required';
        if (!formData.course) newErrors.course = 'Course is required';
        if (!formData.branch) newErrors.branch = 'Branch is required';
        if (!formData.semester) newErrors.semester = 'Semester is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.name) newErrors.name = 'Name is required';*/
        setErrors(newErrors);
        console.log("Hello");
        if (Object.keys(newErrors).length === 0) {
            // All fields are valid, proceed with form submission

            const formDataToSend = new FormData();
            formDataToSend.append('video', formData.video);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('college', formData.college);
            formDataToSend.append('course', formData.course);
            formDataToSend.append('branch', formData.branch);
            formDataToSend.append('semester', formData.semester);
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('email', userData.email);
            formDataToSend.append('name', userData.name);
            formDataToSend.append('otherDetails', formData.otherDetails);
            formDataToSend.append('notes', formData.notes);
            formDataToSend.append('batch', userData.batchYear);

            console.log("Video file object checking");
            console.log(formData.video);

            // Send the formData to your server using a POST request

            console.log("Hello");
            axios
                .post('http://localhost:3001/VideoUpload', formDataToSend)
                .then((response) => {
                    navigate('/videos');
                    console.log('Uploaded');
                })
                .catch((error) => {
                    console.error('Not Uploaded', error);
                });
        }
    };

    const verifyVideo = async (event) => {

        const loading = toast.info("Verifying...", { autoClose: false });
        event.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('video', formData.video);

        try {
            // Send a POST request to the Flask backend
            const response = await fetch('http://localhost:5000/classify_video', {
                method: 'POST',
                body: formDataToSend,
            });
            console.log(response)
            // if (response.ok) {
            const result = await response.json();
            console.log('Classification result:', result.result);
            if (result.result == 1) {
                setVerified(1)
                toast.dismiss(loading);
                // alert("Your video is study related.");
                // toast.success("Successfully verified as study related content.", { autoClose: 10000 })
                toast.success("Verified as Study Content!", { autoClose: 10000 })
            }
            else {
                // alert("Your Video is not study Related");
                toast.dismiss(loading);
                toast.error("Verified as Non-Study Content!", { autoClose: 10000 })
            }
            //   } else {
            //     console.error('Error:', response.statusText);
            //   }
        } catch (error) {
            console.error('Error:', error);
        }
    }



    // const fetchColleges = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:3001/colleges'); // Replace with your backend API endpoint
    //         setColleges(response.data.colleges);
    //     } catch (error) {
    //         console.error('Error fetching colleges:', error);
    //     }
    // };

    const fetchColleges = () => {
        axios.post('http://localhost:3001/colleges')
            .then(response => {
                //console.log("college here");
                setColleges(response.data);
                //console.log(colleges.programs.course);
            })
            .catch(error => {
                console.error('Error fetching colleges:', error);
            });
    };

    useEffect(() => {
        // Fetch colleges when component mounts
        fetchColleges();
    }, []);



    /*useEffect(() => {
        if (formData.college) {
            const selectedCollegeObj = colleges.find(college => college.nickname === formData.college);
            if (selectedCollegeObj) {
                setselectedclpr(selectedCollegeObj.programs);
                //console.log(selectedclpr);
            }
        }
    }, [formData.college, colleges]);*/

    useEffect(() => {
        setCourseSelected(false);
        //console.log("hell");
        // Log selectedclpr after it's updated
    }, [formData.college]);

    useEffect(() => {
        console.log(selectedclpr); // Log selectedclpr after it's updated
    }, [selectedclpr]); // Run this effect whenever selectedclpr changes

    useEffect(() => {
        console.log(branches); // Log selectedclpr after it's updated
    }, [branches]); // Run this effect whenever selectedclpr changes

    useEffect(() => {

        if (!!(formData.college) || !!(formData.course)) {
            setgoodsem(false);
        }
    }, [formData.college, formData.course]);

    useEffect(() => {
        // Fetch colleges when component mounts
        //console.log("thai to che");
        console.log(isgoodsem);
    }, [isgoodsem]);





    return (
        <div style={{ background: 'rgba(0, 0, 0, 0.5)', height: '50rem', display: 'grid', justifyContent: 'center' }}>
            <div><ToastContainer /></div>
            <div className='uploadBox' style={{ marginTop: '-24%', width: '107%', marginLeft: '-4%' }}>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h3 style={{ textAlign: 'center', fontWeight: '550' }}>Upload Video</h3>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    onChange={handleChange}
                                    value={formData.title}
                                    required
                                />
                                {errors.title && <div>{errors.title}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="otherDetails">Description</label>
                                <input
                                    type="text"
                                    id="otherDetails"
                                    name="otherDetails"
                                    onChange={handleChange}
                                    value={formData.otherDetails}
                                    required
                                />
                                {errors.otherDetails && <div>{errors.otherDetails}</div>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    onChange={handleChange}
                                    value={formData.subject}
                                    required
                                />
                                {errors.subject && <div>{errors.subject}</div>}
                            </div>
                            <div className="col-md-6">
                                {/* <label htmlFor="college">College</label> */}
                                <label htmlFor="college">College</label>
                                <select
                                    id="college"
                                    name="college"
                                    onChange={handleChangecl}
                                    value={formData.college}
                                    required
                                >
                                    <option value="">Select College</option>
                                    {colleges.map(college => (
                                        <option key={college._id} value={college.nickname}>{college.name}</option>
                                    ))}
                                </select>
                                {errors.college && <div>{errors.college}</div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="course">Course</label>
                                <select
                                    id="course"
                                    name="course"
                                    onChange={handleChange}
                                    value={formData.course}
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
                                {errors.course && <div>{errors.course}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="branch">Branch</label>
                                <select
                                    id="branch"
                                    name="branch"
                                    onChange={handleChange}
                                    value={formData.branch}
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
                                {errors.branch && <div>{errors.branch}</div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="semester">Semester</label>
                                <select
                                    id="semester"
                                    name="semester"
                                    onChange={handleChange}
                                    value={formData.semester}
                                    disabled={!isgoodsem || !courseSelected || !collegeSelected}
                                    required
                                    style={(isgoodsem && courseSelected && collegeSelected) ? {} : { filter: 'blur(2px)', pointerEvents: 'none' }} // Apply inline styles based on courseSelected
                                >
                                    <option value="">Select Semester</option>
                                    {sems && Array.from({ length: sems }).map((_, index) => (
                                        <option key={index + 1} value={index + 1}>{index + 1}</option>
                                    ))}
                                </select>
                                {errors.semester && <div>{errors.semester}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="video">Upload Video</label>
                                <input
                                    type="file"
                                    id="video"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                {errors.video && <div>{errors.video}</div>}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes">Google drive link for notes</label>
                            <input
                                type="text"
                                id="notes"
                                name="notes"
                                onChange={handleChange}
                                value={formData.notes}
                            />
                            {errors.notes && <div>{errors.notes}</div>}
                        </div>
                        {
                            verified &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button type="submit">Upload</button>
                            </div>
                        }
                        {
                            !verified &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button onClick={verifyVideo}>Verify the video</button>
                            </div>
                        }

                    </form>
                </div>
            </div>
        </div>
    );
};

export default VideoUploadForm;