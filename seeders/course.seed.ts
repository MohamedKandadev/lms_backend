import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv'
dotenv.config()

import connectDb from '../utils/db';
import Course from '../models/course.model';
import { Course as ICourse } from '../interfaces/course.interface';

let courses: ICourse[] = [
  {
    name: 'Next.js & React - The Complete Guide (incl. Two Paths!)',
    description: 'Learn NextJS from the ground up and build production-ready, fullstack ReactJS apps with the NextJS framework!',
    price: 80,
    estimatedPrice: 100,
    tags: "NEXTJS, FRONTEND, REACTJS",
    level: 'intermediate',
    demoUrl: 'hhh123',
    benefits: [{title: 'You will be able to build your web site'}],
    prerequisites: [{title: 'You need some basic html and css and javascript'}],
    courseData: [],
    reviews: []
  },
  {
    name: 'NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)',
    description: 'Master Node JS & Deno.js, build REST APIs with Node.js, GraphQL APIs, add Authentication, use MongoDB, SQL & much more!',
    price: 20,
    estimatedPrice: 200,
    tags: "NODEJS, RESTAPI, BACKEND",
    level: 'intermediate',
    demoUrl: 'hhh123',
    benefits: [{title: 'You will be able to build your web site'}],
    prerequisites: [{title: 'You need some basic html and css and javascript'}],
    courseData: [],
    reviews: []
  },
  {
    name: 'Git & GitHub - The Practical Guide',
    description: 'Learn Git & GitHub and master working with commits, branches, the stash, cherry picking, rebasing, pull requests & more!',
    price: 30,
    estimatedPrice: 80,
    tags: "GITHUB, GITLAB",
    level: 'intermediate',
    demoUrl: 'hhh123',
    benefits: [{title: 'You will be able to build your web site'}],
    prerequisites: [{title: 'You need some basic html and css and javascript'}],
    courseData: [],
    reviews: []
  }
]

connectDb();
const addCourses: any = asyncHandler(async () => {
  await Course.insertMany(courses);
})
export default addCourses;