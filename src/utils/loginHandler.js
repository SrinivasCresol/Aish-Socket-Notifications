import {
  phlebotomistLogin,
  doctorLogin,
  nurseLogin,
  physioLogin,
  elderlyCareLogin,
  careTakerLogin,
  radiologyLabLogin,
} from "../api/authService";

export const loginApiMap = {
  phlebotomist: phlebotomistLogin,
  doctor: doctorLogin,
  nurse: nurseLogin,
  physio: physioLogin,
  elderlyCare: elderlyCareLogin,
  careTaker: careTakerLogin,
  radiologyLab: radiologyLabLogin,
};
