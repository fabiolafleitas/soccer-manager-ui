import axios from "axios";

export const getGroupTactics = () => {
  return axios.get('http://localhost:8000/tactic')
}