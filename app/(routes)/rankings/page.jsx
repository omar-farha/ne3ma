/**
 * صفحة التصنيفات
 * هذه الصفحة تعرض أفضل البائعين والأفراد بناءً على التقييمات
 * يتم حساب التصنيف بناءً على تقييمات العملاء وعدد الإعلانات النشطة
 *
 * Rankings Page
 * This page displays top sellers and individuals based on ratings
 * Rankings are calculated based on customer ratings and number of active listings
 */

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { RatingService } from "@/lib/services/rating-service";
import { TopRankedCard } from "@/components/ui/top-ranked-card";
import { RankingCard } from "@/components/ui/ranking-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Building2, TrendingUp } from "lucide-react";

export default function RankingsPage() {
  const [businessRankings, setBusinessRankings] = useState([]);
  const [individualRankings, setIndividualRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("business");

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both in parallel for better performance
      const [businessResult, individualResult] = await Promise.all([
        RatingService.getTopRankedUsers("business", 20),
        RatingService.getTopRankedUsers("individual", 20)
      ]);

      setBusinessRankings(businessResult.data || []);
      setIndividualRankings(individualResult.data || []);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const renderTop3 = useCallback((rankings) => {
    const top3 = rankings.slice(0, 3);

    if (top3.length === 0) {
      return (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No rankings available yet</p>
        </div>
      );
    }

    // Reorder for podium effect: 2nd, 1st, 3rd
    const podiumOrder = [
      top3[1], // 2nd place
      top3[0], // 1st place (center)
      top3[2]  // 3rd place
    ].filter(Boolean);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {podiumOrder.map((user) => (
          user && (
            <div
              key={user.id}
              className={`${user.rank === 1 ? "md:order-2" : user.rank === 2 ? "md:order-1" : "md:order-3"}`}
            >
              <TopRankedCard user={user} rank={user.rank} />
            </div>
          )
        ))}
      </div>
    );
  }, []);

  const renderRemainingRankings = useCallback((rankings) => {
    const remaining = rankings.slice(3);

    if (remaining.length === 0) {
      return null;
    }

    return (
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Other Top Performers
        </h3>
        {remaining.map((user) => (
          <RankingCard key={user.id} user={user} rank={user.rank} />
        ))}
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rankings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 fill-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Top Rankings
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our top-rated sellers based on customer ratings and sales performance
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-200 p-1 rounded-lg">
              <TabsTrigger
                value="business"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Building2 className="w-4 h-4" />
                <span className="font-semibold">Businesses</span>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  {businessRankings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="individual"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Users className="w-4 h-4" />
                <span className="font-semibold">Individuals</span>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  {individualRankings.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Business Rankings */}
          <TabsContent value="business" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Top Business Sellers
              </h2>
              {renderTop3(businessRankings)}
              {renderRemainingRankings(businessRankings)}
            </div>
          </TabsContent>

          {/* Individual Rankings */}
          <TabsContent value="individual" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Top Individual Sellers
              </h2>
              {renderTop3(individualRankings)}
              {renderRemainingRankings(individualRankings)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            How Rankings Work
          </h3>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Rankings are calculated based on a combination of factors:
            <strong> customer ratings (70%)</strong> and
            <strong> number of active listings (30%)</strong>.
            Users with higher ratings and more listings rank higher.
            Only users with at least one rating are included in the rankings.
          </p>
        </div>
      </div>
    </div>
  );
}
