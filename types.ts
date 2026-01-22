
export enum Page {
  LOGIN = 'login',
  SURVEY_SELECT = 'survey_select',
  SURVEY_BIRTHDAY = 'survey_birthday',
  SURVEY_CAREER = 'survey_career',
  THANKS = 'thanks',
  DASHBOARD = 'dashboard'
}

export interface UserInfo {
  email: string;
}

export interface BirthdaySurveyData {
  sentiment: number;
  connectionLevel: number;
  emotions: string[];
  feedback: string;
}

export interface CareerSurveyData {
  satisfaction: number;
  frequency: string;
  topics: string[];
  suggestions: string;
}

export interface InsightResult {
  sentimentScore: number;
  summary: string;
  actionableStep: string;
}

export interface HistoricalDataPoint {
  date: string;
  score: number;
  count: number;
}
