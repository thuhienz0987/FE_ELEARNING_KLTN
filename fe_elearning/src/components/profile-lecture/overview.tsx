'use client';

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  FileQuestion,
  Star,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '../ui/dashboard-chart';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AnimateWrapper from '../animations/animateWrapper';
import { RatingStars } from '../rating/ratingStars';
import {
  APIAverageCourseRating,
  APIAverageStudentEngagement,
  APICourseCompletionRate,
  APIInstructorOverview,
  APIInstructorRevenue,
  APINextPayout,
  APIPayoutSummary,
  APIRevenueByCourse,
  APIStudentGrowth,
} from '@/utils/instructor-dashboard';
import { useEffect, useState } from 'react';
import {
  CourseCompletionRateType,
  InstructorOverviewType,
  CumulativeFeedChartType,
  FeedChartType,
  PayoutSummaryType,
  NextPayoutType,
  StudentEngagementType,
  CourseRatingType,
} from '@/types/instructorType';
import { DashboardSkeleton } from '../skeleton/dashboardSkeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { APIGetCommentsForInstructor } from '@/utils/comment';
import { LectureComment } from '@/types/commentType';
import { Spinner } from '../ui/spinner';
import { APIGetInstructorRatings } from '@/utils/rating';
import { ReviewCourseType } from '@/types/reviewCourseType';
import { APIGetInstructorThreads } from '@/utils/thread';
import { CommunityThread } from '@/types/communityThreadType';

export const Overview = () => {
  const [overviewData, setOverviewData] = useState<InstructorOverviewType | null>(null);
  const [studentGrowthData, setStudentGrowthData] = useState<CumulativeFeedChartType | null>(null);
  const [courseCompletionRateData, setCourseCompletionRateData] = useState<
    CourseCompletionRateType[] | null
  >(null);
  const [revenueData, setRevenueData] = useState<FeedChartType | null>(null);
  const [revenueByCourseData, setRevenueByCourseData] = useState<FeedChartType | null>(null);
  const [payoutSummaryData, setPayoutSummaryData] = useState<PayoutSummaryType | null>(null);
  const [nextPayoutData, setNextPayoutData] = useState<NextPayoutType | null>(null);
  const [averageStudentEngagementData, setAverageStudentEngagementData] = useState<
    StudentEngagementType[] | null
  >(null);
  const [courseRatingData, setCourseRatingData] = useState<CourseRatingType[] | null>(null);
  const [recentComments, setRecentComments] = useState<LectureComment[]>([]);
  const [recentRatings, setRecentRatings] = useState<ReviewCourseType[]>([]);
  const [recentThreads, setRecentThreads] = useState<CommunityThread[]>([]);
  const [recentThreadsToReply, setRecentThreadsToReply] = useState<CommunityThread[]>([]);

  const [commentsAfterCursor, setCommentsAfterCursor] = useState<string | null>(null);
  const [ratingsAfterCursor, setRatingsAfterCursor] = useState<string | null>(null);
  const [threadsAfterCursor, setThreadsAfterCursor] = useState<string | null>(null);
  const [threadsToReplyAfterCursor, setThreadsToReplyAfterCursor] = useState<string | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);

  const [registrationViewMode, setRegistrationViewMode] = useState<'monthly' | 'cumulative'>(
    'monthly'
  );
  const [feedbackViewMode, setFeedbackViewMode] = useState<'feedback' | 'rating'>('feedback');
  const [threadViewMode, setThreadViewMode] = useState<'all' | 'not_replied'>('not_replied');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    try {
      setIsLoading(true);
      const overviewResponse = await APIInstructorOverview({
        month: currentMonth,
        year: currentYear,
      });
      const studentGrowthResponse = await APIStudentGrowth({
        year: currentYear,
      });
      const courseCompletionRateResponse = await APICourseCompletionRate();
      const revenueResponse = await APIInstructorRevenue({
        year: currentYear,
      });
      const revenueByCourseResponse = await APIRevenueByCourse();
      const payoutSummaryResponse = await APIPayoutSummary();
      const nextPayoutResponse = await APINextPayout();
      const avgStudentEngagementResponse = await APIAverageStudentEngagement();
      const avgCourseRatingResponse = await APIAverageCourseRating();
      const comments = await APIGetCommentsForInstructor({ limit: 5 });
      const ratings = await APIGetInstructorRatings({ limit: 5 });
      const threads = await APIGetInstructorThreads({ limit: 5 });
      const threadsToReply = await APIGetInstructorThreads({
        limit: 5,
        has_replied: false,
      });

      console.log('threads', threads);

      setOverviewData(overviewResponse?.data);
      setStudentGrowthData(studentGrowthResponse?.data);
      setCourseCompletionRateData(courseCompletionRateResponse?.data);
      setRevenueData(revenueResponse?.data);
      setRevenueByCourseData(revenueByCourseResponse?.data);
      setPayoutSummaryData(payoutSummaryResponse?.data);
      setNextPayoutData(nextPayoutResponse?.data);
      setAverageStudentEngagementData(avgStudentEngagementResponse?.data);
      setCourseRatingData(avgCourseRatingResponse?.data);
      setRecentComments(comments?.data);
      setCommentsAfterCursor(comments?.pagination.afterCursor);
      setRecentRatings(ratings?.data);
      setRatingsAfterCursor(ratings?.pagination.afterCursor);
      setRecentThreads(threads?.data);
      setThreadsAfterCursor(threads?.pagination.afterCursor);
      setRecentThreadsToReply(threadsToReply?.data);
      setThreadsToReplyAfterCursor(threadsToReply?.pagination.afterCursor);
    } catch (err) {
      setError('Failed to fetch overview data');
      console.log('Error fetching overview data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (isLoadingComments || !commentsAfterCursor) return;
    setIsLoadingComments(true);

    const newComments = await APIGetCommentsForInstructor({
      limit: 5,
      afterCursor: commentsAfterCursor,
    });

    setCommentsAfterCursor(newComments?.pagination.afterCursor);
    setRecentComments((prev) => [...prev, ...newComments.data]);

    setIsLoadingComments(false);
  };

  const loadMoreRatings = async () => {
    if (isLoadingComments || !ratingsAfterCursor) return;
    setIsLoadingComments(true);

    const newRatings = await APIGetInstructorRatings({
      limit: 5,
      afterCursor: ratingsAfterCursor,
    });

    setRatingsAfterCursor(newRatings?.pagination.afterCursor);
    setRecentRatings((prev) => [...prev, ...newRatings.data]);

    setIsLoadingComments(false);
  };

  const loadMoreThreads = async (has_replied?: boolean) => {
    if (isLoadingThreads || !threadsAfterCursor) return;
    setIsLoadingThreads(true);

    const newThreads = await APIGetInstructorThreads({
      limit: 5,
      afterCursor: threadsAfterCursor,
      has_replied,
    });
    if (has_replied == false) {
      setThreadsToReplyAfterCursor(newThreads?.pagination.afterCursor);
      setRecentThreadsToReply((prev) => [...prev, ...newThreads.data]);
    } else {
      setThreadsAfterCursor(newThreads?.pagination.afterCursor);
      setRecentThreads((prev) => [...prev, ...newThreads.data]);
    }

    setIsLoadingThreads(false);
  };

  const handleCommentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop > target.clientHeight * 0.7) {
      if (feedbackViewMode == 'feedback') loadMoreComments();
      else loadMoreRatings();
    }
  };

  const handleThreadScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop > target.clientHeight * 0.7) {
      if (threadViewMode == 'all') loadMoreThreads();
      else loadMoreThreads(false);
    }
  };

  const transformToCumulateChartData = (data: CumulativeFeedChartType) => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (data.year === currentYear) {
      return data.labels.slice(0, currentMonthIndex + 1).map((label, index) => ({
        name: label,
        value: data.cumulative_data[index],
      }));
    }

    return data.labels.map((label, index) => ({
      name: label,
      value: data.cumulative_data[index],
    }));
  };

  const transformToChartData = (data: FeedChartType) => {
    return data.labels.map((label, index) => ({
      name: label,
      value: data.data[index],
    }));
  };

  const sortCourseCompletionRateData = (data: CourseCompletionRateType[]) => {
    const sortedData = data.sort((a, b) => b.completion_rate - a.completion_rate);
    return sortedData;
  };

  const transformEngagementData = (rawData: StudentEngagementType[]) => {
    const sortedData = rawData.sort((a, b) => b.avg_engagement - a.avg_engagement);
    return sortedData.map((item) => ({
      name: item.title,
      value: Math.round(item.avg_engagement),
    }));
  };

  const transformCourseRatingData = (rawData: CourseRatingType[]) => {
    const sortedData = rawData.sort((a, b) => b.average_rating - a.average_rating);
    return sortedData.map((item) => ({
      name: item.title,
      value: item.average_rating,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderSkeleton = () => {
    return <DashboardSkeleton />;
  };

  return (
    <AnimateWrapper delay={0.2} direction="up" amount={0.1}>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số học sinh</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.enrolled_students}</div>
                {String(overviewData?.enrolled_students_monthly_shift) !== '∞' && (
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={`${(overviewData?.enrolled_students_monthly_shift ?? 0) >= 0 ? 'text-vividMalachite' : 'text-redPigment'} flex items-center`}
                    >
                      {(overviewData?.enrolled_students_monthly_shift ?? 0) >= 0 ? (
                        <ArrowUp className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="mr-1 h-4 w-4" />
                      )}
                      {overviewData?.enrolled_students_monthly_shift ?? 0}%
                    </span>{' '}
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoạt động tháng này</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.active_students ?? 0}</div>
                {String(overviewData?.active_students_monthly_shift) !== '∞' && (
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={`${(overviewData?.active_students_monthly_shift ?? 0) > 0 ? 'text-vividMalachite' : 'text-redPigment'} flex items-center`}
                    >
                      {(overviewData?.active_students_monthly_shift ?? 0) > 0 ? (
                        <ArrowUp className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="mr-1 h-4 w-4" />
                      )}
                      {overviewData?.active_students_monthly_shift ?? 0}%
                    </span>{' '}
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.avg_rating ?? 0}</div>
                <RatingStars rating={overviewData?.avg_rating ?? 0} />
                <p className="text-xs text-muted-foreground">
                  {overviewData?.total_ratings_made ?? 0} học viên đã đánh giá
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.total_payout}₫</div>
                <div className="mt-1 flex flex-col gap-1 text-xs"></div>
              </CardContent>
            </Card>
          </div>

          {/* Course Performance Section */}
          {studentGrowthData && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Số Lượng Học Viên Theo Thời Gian</CardTitle>
                      <CardDescription>
                        {registrationViewMode === 'monthly'
                          ? 'Số lượng học viên đăng ký mỗi tháng'
                          : 'Tổng Số Lượng Đăng Ký Học Viên'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 rounded-md border p-1">
                      <Button
                        variant={registrationViewMode === 'monthly' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setRegistrationViewMode('monthly')}
                        className="text-xs"
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={registrationViewMode === 'cumulative' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setRegistrationViewMode('cumulative')}
                        className="text-xs"
                      >
                        Cumulative
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-80">
                  <Chart
                    type={registrationViewMode === 'monthly' ? 'bar' : 'line'}
                    data={
                      registrationViewMode === 'monthly'
                        ? transformToChartData(studentGrowthData)
                        : transformToCumulateChartData(studentGrowthData)
                    }
                    categories={['value']}
                    index="name"
                    colors={['#0ea5e9']}
                    valueFormatter={(value) => `${value} students`}
                    showLegend={false}
                    showGridLines={false}
                    startEndOnly={false}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tỉ Lệ Hoàn Thành Khóa Học</CardTitle>
                    <CardDescription>
                      Tỷ lệ phần trăm học viên hoàn thành mỗi khóa học
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        View More
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Tỉ Lệ Hoàn Thành Khóa Học</DialogTitle>
                        <DialogDescription>
                          Phân tích chi tiết tỷ lệ hoàn thành của tất cả các khóa học của bạn
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto pr-2">
                        <div className="space-y-4 py-4">
                          {courseCompletionRateData &&
                            sortCourseCompletionRateData(courseCompletionRateData).map(
                              (course, index) => (
                                <div key={`course-completion-${index}`} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{course.title}</span>
                                    <span className="text-sm font-medium">
                                      {course.completion_rate}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={course.completion_rate}
                                      className="h-2 flex-1"
                                    />
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        course.completion_rate >= 85
                                          ? 'bg-vividMalachite'
                                          : course.completion_rate >= 70
                                            ? 'bg-amber'
                                            : 'bg-redPigment'
                                      }`}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                      {course.completion_rate >= 85
                                        ? 'Xuất sắc'
                                        : course.completion_rate >= 70
                                          ? 'Tốt'
                                          : 'Cần cải thiện'}
                                    </span>
                                    <span>
                                      {course.completed_students} trên {course.total_students}
                                      học viên hoàn thành
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                      <div className="flex justify-between border-t pt-4">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-vividMalachite" />
                            <span>≥ 85% (Xuất sắc)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-amber" />
                            <span>70-84% (Tốt)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-redPigment" />
                            <span>{'<'} 70% (Cần cải thiện)</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sortCourseCompletionRateData(courseCompletionRateData ?? [])
                    .slice(0, 5)
                    .map((item, index) => (
                      <div className="space-y-2" key={index}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{item.title}</span>
                          <span className="text-sm font-medium">{item.completion_rate}%</span>
                        </div>
                        <Progress value={item.completion_rate} className="h-2" />
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Income Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Doanh Thu Theo Năm</CardTitle>
                <CardDescription>Doanh thu đạt được mỗi tháng</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart
                  type="bar"
                  data={revenueData ? transformToChartData(revenueData) : []}
                  categories={['value']}
                  index="name"
                  colors={['#10b981']}
                  valueFormatter={(value) => `$${value}`}
                  showLegend={false}
                  showGridLines={false}
                  startEndOnly={false}
                  showXAxis={true}
                  showYAxis={true}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Doanh Thu Theo Khóa Học</CardTitle>
                <CardDescription>Tổng doanh thu thu về từ mỗi khóa học</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart
                  type="pie"
                  data={revenueByCourseData ? transformToChartData(revenueByCourseData) : []}
                  category="value"
                  index="name"
                  valueFormatter={(value) => `$${value}`}
                  showLegend={true}
                  showGridLines={false}
                  showXAxis={false}
                  showYAxis={false}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Trạng Thái Doanh Thu (
                {new Date().toLocaleString('vi-VN', { month: 'long', year: 'numeric' })})
              </CardTitle>
              <CardDescription>Phân tích doanh thu tháng hiện tại</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Tổng Doanh Thu</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleString('en-EN', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-2xl font-bold">{payoutSummaryData?.total}₫</div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Số tiền có thể thanh toán</span>
                      <span className="text-sm font-medium text-vividMalachite">
                        {payoutSummaryData?.available_for_payout}₫ (
                        {payoutSummaryData?.available_percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-vividMalachite"
                        style={{ width: `${payoutSummaryData?.available_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tiền đang giữ (Tháng hiện tại)</span>
                      <span className="text-sm font-medium text-majorelleBlue">
                        {payoutSummaryData?.in_30_day_holding}₫ (
                        {payoutSummaryData?.holding_percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-majorelleBlue"
                        style={{ width: `${payoutSummaryData?.holding_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tiền đang giữ (Tháng sau)</span>
                      <span className="text-sm font-medium text-amber">
                        {payoutSummaryData?.next_holding}₫ (
                        {payoutSummaryData?.next_holding_percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber"
                        style={{ width: `${payoutSummaryData?.next_holding_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <div className="mr-1 h-2 w-2 rounded-full bg-vividMalachite"></div>
                      Số tiền có thể thanh toán
                    </span>
                    <span>Sẵn sàng cho đợt thanh toán cuối tháng</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <div className="mr-1 h-2 w-2 rounded-full bg-majorelleBlue"></div>
                      Tiền đang giữ (Tháng hiện tại)
                    </span>
                    <span>Sẽ được giải ngân trong tháng này</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <div className="mr-1 h-2 w-2 rounded-full bg-amber"></div>
                      Tiền đang giữ (Tháng sau)
                    </span>
                    <span>Sẽ được giải ngân trong tháng sau</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Đợt Thanh Toán Tiếp Theo</CardTitle>
              <CardDescription>
                Dự kiến vào ngày{' '}
                {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()} tháng{' '}
                {new Date().getMonth() + 1}, {new Date().getFullYear()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Sẵn sàng để thanh toán</p>
                    <p className="text-sm text-muted-foreground">
                      Sẽ được chuyển vào tài khoản ngân hàng của bạn
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-500">
                    {nextPayoutData?.available_to_pay}₫
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Lịch thanh toán hàng tháng</p>
                      <p className="text-sm text-muted-foreground">
                        Các khoản thanh toán được xử lý vào ngày cuối cùng của mỗi tháng
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Phân tích doanh thu theo khóa học</p>
                  <div className="space-y-3">
                    {nextPayoutData?.breakdown?.map((item, index) => (
                      <div className="flex items-center justify-between text-sm" key={index}>
                        <span>{item.title}</span>
                        <span className="font-medium">{item.amount}₫</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement & Ratings Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá khóa học</CardTitle>
                <CardDescription>Đánh giá trung bình cho mỗi khóa học</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart
                  type="bar"
                  data={transformCourseRatingData(courseRatingData ?? []).slice(0, 5)}
                  categories={['value']}
                  index="name"
                  colors={['#f59e0b']}
                  valueFormatter={(value) => `${value} ★`}
                  showLegend={false}
                  showGridLines={false}
                  startEndOnly={false}
                  showXAxis={true}
                  showYAxis={true}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mức độ tương tác của học viên</CardTitle>
                <CardDescription>
                  Tỷ lệ tương tác trung bình của học viên theo từng khóa học
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart
                  type="bar"
                  data={
                    averageStudentEngagementData
                      ? transformEngagementData(averageStudentEngagementData).slice(0, 5)
                      : []
                  }
                  categories={['value']}
                  index="name"
                  colors={['#6366f1']}
                  valueFormatter={(value) => `${value}%`}
                  showLegend={false}
                  showGridLines={false}
                  startEndOnly={false}
                  showXAxis={true}
                  showYAxis={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Feedback & Notifications */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Feedback Gần Đây</CardTitle>
                    <CardDescription>
                      Feedback gần đây của học viên cho khóa học của bạn
                    </CardDescription>
                  </div>

                  {isLoadingComments && <Spinner size="small" className=" text-majorelleBlue" />}
                </div>
                <div className="flex items-center space-x-1 rounded-md border p-1">
                  <Button
                    variant={feedbackViewMode === 'feedback' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFeedbackViewMode('feedback')}
                    className="text-xs flex-1"
                  >
                    Feedback
                  </Button>
                  <Button
                    variant={feedbackViewMode === 'rating' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFeedbackViewMode('rating')}
                    className="text-xs flex-1"
                  >
                    Đánh giá
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="space-y-4 max-h-[350px] overflow-y-auto"
                  onScroll={handleCommentScroll}
                >
                  {feedbackViewMode == 'feedback'
                    ? recentComments?.map((comment, index) => (
                        <div className="border-b pb-4" key={index}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                                  comment.user.profile_image.key
                                }
                                alt="Student"
                              />
                              <AvatarFallback>
                                {comment.user.first_name[0]}
                                {comment.user.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {comment.user.first_name} {comment.user.last_name}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {comment.lecture.section.course.title}
                                {'>'}
                                {comment.lecture.section.title}
                                {'>'}
                                {comment.lecture.title}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">"{comment.content}"</p>
                          <div className="flex flex-wrap gap-2 justify-end pr-2">
                            {comment.aspects.map((aspect) => {
                              const emotionColor =
                                aspect.emotion === 'positive'
                                  ? 'bg-greenCrayola/10 text-greenCrayola'
                                  : aspect.emotion === 'neutral'
                                    ? 'bg-blueberry/10 text-blueberry'
                                    : 'bg-carminePink/10 text-carminePink';
                              return (
                                <Badge
                                  key={aspect.comment_aspect_id}
                                  variant="outline"
                                  className={`flex items-center gap-1 ${emotionColor}`}
                                >
                                  <span>
                                    {aspect.aspect === 'instructor_quality'
                                      ? 'Chất lượng giảng viên'
                                      : aspect.aspect === 'content_quality'
                                        ? 'Chất lượng nội dung'
                                        : aspect.aspect === 'technology'
                                          ? 'Công nghệ'
                                          : aspect.aspect === 'teaching_pace'
                                            ? 'Tốc độ dạy'
                                            : aspect.aspect === 'study_materials'
                                              ? 'Tài liệu học tập'
                                              : aspect.aspect === 'assignments_practice'
                                                ? 'Bài tập và thực hành'
                                                : aspect.aspect === 'other'
                                                  ? 'Khác'
                                                  : aspect.aspect}
                                  </span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    : recentRatings?.map((rating, index) => (
                        <div className="border-b pb-4" key={index}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                                  (rating?.user?.profile_image?.key || '')
                                }
                                alt="Student"
                              />
                              <AvatarFallback>
                                {rating.user.first_name?.[0] || ''}
                                {rating.user.last_name?.[0] || ''}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {rating.user.first_name} {rating.user.last_name}
                                </span>
                                <RatingStars rating={rating.rating || 0} />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {rating.course.title}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">
                            {rating.rating_comment ? `"${rating.rating_comment}"` : null}
                          </p>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Câu Hỏi và Giải Đáp</CardTitle>
                    <CardDescription>Những câu hỏi gần đây của học viên của bạn</CardDescription>
                  </div>
                  {isLoadingThreads && <Spinner size="small" className=" text-majorelleBlue" />}
                </div>
                <div className="flex items-center space-x-1 rounded-md border p-1">
                  <Button
                    variant={threadViewMode === 'not_replied' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setThreadViewMode('not_replied')}
                    className="text-xs flex-1"
                  >
                    Chưa phản hồi
                  </Button>
                  <Button
                    variant={threadViewMode === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setThreadViewMode('all')}
                    className="text-xs flex-1"
                  >
                    Tất cả
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="space-y-4 max-h-[350px] overflow-y-auto"
                  onScroll={handleThreadScroll}
                >
                  {threadViewMode == 'not_replied'
                    ? recentThreadsToReply.map((thread, index) => (
                        <div className="flex items-start gap-4 rounded-lg border p-4" key={index}>
                          <FileQuestion className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div>
                            <h4 className="font-semibold">{thread.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Học viên {thread.author.first_name} {thread.author.last_name} đã đặt
                              câu hỏi trong khóa{' '}
                              <span className=" text-black">
                                "{thread.lecture.section.course.title}"
                              </span>
                            </p>
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                Xem chi tiết
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    : recentThreads.map((thread, index) => (
                        <div className="flex items-start gap-4 rounded-lg border p-4" key={index}>
                          <FileQuestion className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div>
                            <h4 className="font-semibold">{thread.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Học viên {thread.author.first_name} {thread.author.last_name} đã đặt
                              câu hỏi trong khóa{' '}
                              <span className=" text-black">
                                "{thread.lecture.section.course.title}"
                              </span>
                            </p>
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                Xem chi tiết
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Most Viewed Lectures */}
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Lectures</CardTitle>
              <CardDescription>Lectures with the highest view counts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Introduction to JavaScript</h4>
                      <p className="text-sm text-muted-foreground">Web Development</p>
                    </div>
                  </div>
                  <Badge variant="secondary">1,245 views</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">UI Design Principles</h4>
                      <p className="text-sm text-muted-foreground">UI/UX Design</p>
                    </div>
                  </div>
                  <Badge variant="secondary">1,120 views</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Data Visualization Techniques</h4>
                      <p className="text-sm text-muted-foreground">Data Science</p>
                    </div>
                  </div>
                  <Badge variant="secondary">985 views</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">React Native Fundamentals</h4>
                      <p className="text-sm text-muted-foreground">Mobile App Development</p>
                    </div>
                  </div>
                  <Badge variant="secondary">876 views</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">SEO Strategies</h4>
                      <p className="text-sm text-muted-foreground">Digital Marketing</p>
                    </div>
                  </div>
                  <Badge variant="secondary">754 views</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AnimateWrapper>
  );
};
