import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const CourseList = ({ contract }) => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    getCoursesFromBlockchain();
  }, [contract]);

  const createCourse = async () => {
    try {
      const priceWei = ethers.parseEther(newCourse.price);
      const txn = await contract.createCourse(
        newCourse.title,
        newCourse.description,
        priceWei
      );
      await txn.wait();
      getCoursesFromBlockchain();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const getCoursesFromBlockchain = async () => {
    try {
      const coursesArray = await contract.getCourses();
      const courses = coursesArray.map((course) => ({
        title: course.title,
        description: course.description,
        price: ethers.formatUnits(course.price, "ether"),
        creator: course.creator,
        enrolledStudents: course.enrolledStudents,
      }));
      setCourses(courses);
      const userEnrollmentsArray = await contract.getCoursesByStudent();
      const userEnrollments = userEnrollmentsArray.map((enrollment) => {
        const courseId = enrollment[0];
        return courseId;
      });
      setEnrollments(userEnrollments);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      if (!enrollments.includes(courseId)) {
        const priceWei = ethers.parseEther(courses[courseId].price);
        await contract.enroll(courseId, { value: priceWei });
        getCoursesFromBlockchain();
      } else {
        alert("Already enrolled in this course");
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4 flex justify-between items-center">
        Market your courses with
        <span className="text-red-300">EduMarketeers</span>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Add Course
        </button>
      </h1>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className="border p-4 rounded-md shadow-md hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="text-gray-700">Price: {course.price} ETH</p>
              <p className="text-gray-700">Creator: {course.creator}</p>
              {enrollments.includes(course.title) ? (
                <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md cursor-not-allowed">
                  Already Enrolled
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(index)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Enroll
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No courses available.</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Course Modal"
      >
        <h2 className="text-xl font-semibold mb-4">Add Course</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCourse();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              className="w-full border p-2 rounded-md"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price (ETH):
            </label>
            <input
              type="number"
              step="any"
              className="w-full border p-2 rounded-md"
              value={newCourse.price}
              onChange={(e) =>
                setNewCourse({ ...newCourse, price: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Create Course
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CourseList;
