import React from 'react';
import { BarChart, TrendingUp, Hash, Clock, Sparkles, Users, Zap } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUserInsights, useGlobalInsights, useAISuggestions } from '@/hooks/useAnalytics';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const Analytics = () => {
  const { data: userInsights, isLoading: isLoadingUser } = useUserInsights();
  const { data: globalInsights, isLoading: isLoadingGlobal } = useGlobalInsights();
  const { data: suggestions, isLoading: isLoadingSuggestions } = useAISuggestions();

  if (isLoadingUser || isLoadingGlobal || isLoadingSuggestions) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  const selectionPercentageA = userInsights?.totalPosts 
    ? Math.round((userInsights.selectionPreference.optionA / userInsights.totalPosts) * 100) 
    : 0;

  const mostActiveHour = userInsights?.postsByHour?.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current
  , { hour: 0, count: 0 });

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full gradient-primary mb-4">
            <BarChart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Analytics & Insights
          </h1>
          <p className="text-text-secondary">
            Understand your content preferences and optimize your posts
          </p>
        </div>

        {/* User Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userInsights?.totalPosts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Content created with AI
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userInsights?.averageMetrics.responseTime 
                  ? `${(userInsights.averageMetrics.responseTime / 1000).toFixed(1)}s` 
                  : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                AI generation speed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Caption Length</CardTitle>
              <Hash className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userInsights?.averageMetrics.captionLength || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Characters per caption
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Active Hour</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostActiveHour ? `${mostActiveHour.hour}:00` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Peak creation time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Selection Preference */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Preference</CardTitle>
            <CardDescription>
              Which option do you prefer more often?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Option A</span>
                <span>{selectionPercentageA}%</span>
              </div>
              <Progress value={selectionPercentageA} className="h-3" />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{userInsights?.selectionPreference.optionA || 0} selections</span>
              <span>{userInsights?.selectionPreference.optionB || 0} selections</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Option B</span>
              <span>{100 - selectionPercentageA}%</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        {suggestions && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>AI Recommendations</CardTitle>
              </div>
              <CardDescription>
                Personalized suggestions based on your history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ideal Caption Length</p>
                  <p className="text-2xl font-bold text-primary">
                    {suggestions.suggestions.idealCaptionLength} chars
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ideal Hashtag Count</p>
                  <p className="text-2xl font-bold text-primary">
                    {suggestions.suggestions.idealHashtagCount} hashtags
                  </p>
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-text-secondary italic">
                  💡 {suggestions.suggestions.tip}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Global Insights */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Platform Insights</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Popular Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Hashtags</CardTitle>
                <CardDescription>
                  Most used hashtags across all users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {globalInsights?.popularHashtags.slice(0, 5).map((hashtag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{hashtag.tag}</span>
                      <span className="text-sm text-muted-foreground">
                        {hashtag.count} uses
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Model Performance */}
            <Card>
              <CardHeader>
                <CardTitle>AI Model Performance</CardTitle>
                <CardDescription>
                  Speed and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {globalInsights?.aiModelPerformance.map((model, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {model.model}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {model.usageCount} uses
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(model.avgResponseTime / 5000) * 100} 
                          className="h-2 flex-1" 
                        />
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {(model.avgResponseTime / 1000).toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalInsights?.totalUsers || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalInsights?.totalPosts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Selections</CardTitle>
                <BarChart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalInsights?.totalSelections || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;