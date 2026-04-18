const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  auth: {
    register: (name, email, password) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email, password) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request("/auth/logout", { method: "POST" }),
    getMe: () => request("/auth/me"),
  },
  courses: {
    getAll: () => request("/courses"),
    getById: (id) => request(`/courses/${id}`),
    enroll: (id) => request(`/courses/${id}/enroll`, { method: "POST" }),
    create: (data) =>
      request("/courses", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) =>
      request(`/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/courses/${id}`, { method: "DELETE" }),
    addLesson: (courseId, lesson) =>
      request(`/courses/${courseId}/lessons`, {
        method: "POST",
        body: JSON.stringify(lesson),
      }),
    completeLesson: (courseId, lessonId) =>
      request(`/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: "POST",
      }),
  },
  quizzes: {
    getById: (quizId) => request(`/quizzes/${quizId}`),
    submit: (quizId, answers) =>
      request(`/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      }),
  },
  dashboard: {
    getStudent: () => request("/dashboard/student"),
    getInstructor: () => request("/dashboard/instructor"),
  },
  admin: {
    getUsers: () => request("/admin/users"),
    updateRole: (userId, role) =>
      request(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      }),
    deleteUser: (userId) =>
      request(`/admin/users/${userId}`, { method: "DELETE" }),
  },

  // Add to courses object
  delete: (id) => request(`/courses/${id}`, { method: "DELETE" }),

  // Add to courses object – lesson management
  getLessons: (courseId) => request(`/courses/${courseId}/lessons`), // if you have this endpoint
  addLesson: (courseId, lessonData) =>
    request(`/courses/${courseId}/lessons`, {
      method: "POST",
      body: JSON.stringify(lessonData),
    }),
  updateLesson: (lessonId, lessonData) =>
    request(`/courses/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(lessonData),
    }),
  deleteLesson: (lessonId) =>
    request(`/courses/lessons/${lessonId}`, { method: "DELETE" }),

  // Add to quizzes object – for instructor to create/manage quizzes
  createQuiz: (quizData) =>
    request("/quizzes", { method: "POST", body: JSON.stringify(quizData) }),
  updateQuiz: (quizId, quizData) =>
    request(`/quizzes/${quizId}`, {
      method: "PUT",
      body: JSON.stringify(quizData),
    }),
  deleteQuiz: (quizId) => request(`/quizzes/${quizId}`, { method: "DELETE" }),
  addQuestion: (quizId, questionData) =>
    request(`/quizzes/${quizId}/questions`, {
      method: "POST",
      body: JSON.stringify(questionData),
    }),
  updateQuestion: (questionId, questionData) =>
    request(`/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(questionData),
    }),
  deleteQuestion: (questionId) =>
    request(`/questions/${questionId}`, { method: "DELETE" }),
  addOption: (questionId, optionData) =>
    request(`/questions/${questionId}/options`, {
      method: "POST",
      body: JSON.stringify(optionData),
    }),
  deleteOption: (optionId) =>
    request(`/options/${optionId}`, { method: "DELETE" }),
};
