import dotenv from 'dotenv';

import addUsers from "./user.seed";
import addCourses from "./course.seed";

switch (process.argv[2]) {
  case '-users':{
    addUsers();
    console.log(process.argv[2])
    break;
  }
  case '-courses':{
    addCourses();
    break;
  }
  default:
    break;
}