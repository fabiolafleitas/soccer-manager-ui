import axios from "axios";
import { mockGroup1Data } from "../data/groupData";

const getMockGroup = () => {
  return mockGroup1Data;
}

const getTacticGroups = () => {
  return axios.get('http://localhost:8000/tactic')
}

const getTacticGroup = (tacticGroupId) => {
    return axios.get(`http://localhost:8000/tactic/${tacticGroupId}`)
}

const saveTacticGroup = (tacticGroup) => {
  return axios.post('http://localhost:8000/tactic', tacticGroup)
}

const updateTacticGroup = (tacticGroupId, tacticGroup) => {
  return axios.put(`http://localhost:8000/tactic/${tacticGroupId}`, tacticGroup)
}

export {
  getMockGroup,
  getTacticGroups,
  getTacticGroup,
  saveTacticGroup,
  updateTacticGroup,
}