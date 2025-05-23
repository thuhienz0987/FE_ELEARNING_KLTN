export interface CommentAspect {
  comment_aspect_id: string;
  aspect: string;
  emotion: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: null;
}

export interface LectureComment {
  lecture_comment_id: string;
  lecture_id: string;
  user_id: string;
  content: string;
  is_solved: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: null;
  aspects: CommentAspect[];
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: {
      key: string;
      rejection_reason: null;
      status: string;
      bucket: string;
    };
  };
  lecture: {
    section: {
      title: string;
      course: {
        id: string;
        title: string;
        description: string;
      };
    };
    lecture_id: string;
    id: string;
    title: string;
    position: string;
    is_preview: boolean;
    section_id: string;
    status: string;
    description: string;
    resource_id: null;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: null;
  };
}

export interface StatisticsEachItemCourse {
  instructor_quality: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  content_quality: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  technology: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  teaching_pace: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  study_materials: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  other: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
  assignments_practice: {
    positive: number;
    neutral: number;
    negative: number;
    none: number;
  };
}

export interface StatisticItemCourseResponse {
  comments: LectureComment[];
  statistics: StatisticsEachItemCourse;
}
