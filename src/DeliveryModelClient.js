import axios from "axios";

export default class DeliveryModelClient {
  constructor(projectId) {
    if (!projectId) throw "Missing project Id!";
    this.projectId = projectId;
    this.client = axios.create({
      baseURL: `https://deliver.kontent.ai/${projectId}/`,
      timeout: 100000
    });
  }

  getModelsForProject() {
    return this.client.get(`types`);
  }
}