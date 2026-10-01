import { DatabaseState, IndicatorDefinition, IndicatorScoreResult, InstitutionScoreBreakdown } from '../types';

export class IndicatorEngine {
  /**
   * Calculates actual values for each indicator based on APPROVED records in the database
   */
  public static calculateActualValue(indicator: IndicatorDefinition, db: DatabaseState, deptId?: string): number {
    switch (indicator.code) {
      case 'IND_PUB_01': {
        // Research publications approved
        return db.publications.filter(p => 
          p.verificationStatus === 'approved' && (!deptId || p.departmentId === deptId)
        ).length;
      }
      case 'IND_PAT_01': {
        // Patents filed and published approved
        return db.patents.filter(p => 
          p.verificationStatus === 'approved' && (!deptId || p.departmentId === deptId)
        ).length;
      }
      case 'IND_PAT_02': {
        // Patents granted
        return db.patents.filter(p => 
          p.verificationStatus === 'approved' && p.status === 'Granted' && (!deptId || p.departmentId === deptId)
        ).length;
      }
      case 'IND_GRT_01': {
        // Research Grants in ₹ Lakhs
        const totalLakhs = db.grants
          .filter(g => g.verificationStatus === 'approved' && (!deptId || g.departmentId === deptId))
          .reduce((sum, g) => sum + (g.amount || 0), 0);
        return Math.round(totalLakhs * 10) / 10;
      }
      case 'IND_STU_01': {
        // Startups incubated
        return db.startups.filter(s => 
          s.verificationStatus === 'approved' && (!deptId || s.departmentId === deptId)
        ).length;
      }
      case 'IND_PRJ_01': {
        // Completed innovation projects
        return db.projects.filter(p => 
          p.verificationStatus === 'approved' && (!deptId || p.departmentId === deptId)
        ).length;
      }
      case 'IND_CMP_01': {
        // Competitions won/finalist
        return db.competitions.filter(c => 
          c.verificationStatus === 'approved' && (!deptId || c.departmentId === deptId)
        ).length;
      }
      case 'IND_EVT_01': {
        // Events conducted
        return db.events.filter(e => 
          e.verificationStatus === 'approved' && (!deptId || e.departmentId === deptId)
        ).length;
      }
      default: {
        // Generic fallback or custom indicator: count awards or projects
        return db.awards.filter(a => a.verificationStatus === 'approved' && (!deptId || a.departmentId === deptId)).length;
      }
    }
  }

  /**
   * Computes the institutional score breakdown and individual indicator achievements
   */
  public static computeInstitutionalScore(db: DatabaseState, deptId?: string): InstitutionScoreBreakdown {
    const activeIndicators = db.indicators.filter(ind => ind.isActive);
    const totalWeight = activeIndicators.reduce((sum, ind) => sum + ind.weight, 0);

    const results: IndicatorScoreResult[] = activeIndicators.map(ind => {
      const actual = this.calculateActualValue(ind, db, deptId);
      // Normalized achievement capped at 100% or unbounded up to 125% with bonus
      const rawRatio = ind.target > 0 ? (actual / ind.target) : 0;
      // capped at 1.0 (100%) for standard institutional indicator scoring
      const achievementPercentage = Math.round(Math.min(rawRatio, 1.0) * 1000) / 10; // e.g. 84.5%
      
      // Normalized weight if sum != 100
      const effectiveWeight = totalWeight > 0 ? (ind.weight / totalWeight) * 100 : ind.weight;
      const weightedScore = Math.round(((Math.min(rawRatio, 1.0) * effectiveWeight)) * 10) / 10;
      const gap = Math.max(0, ind.target - actual);

      let status: IndicatorScoreResult['status'] = 'On Track';
      if (rawRatio >= 1.0) status = 'Exceeded';
      else if (rawRatio >= 0.7) status = 'On Track';
      else if (rawRatio >= 0.4) status = 'Attention Required';
      else status = 'Lagging';

      return {
        indicatorId: ind.id,
        code: ind.code,
        name: ind.name,
        category: ind.category,
        weight: ind.weight,
        target: ind.target,
        actual,
        achievementPercentage,
        weightedScore,
        gap,
        status
      };
    });

    const overallScore = Math.round(results.reduce((sum, r) => sum + r.weightedScore, 0) * 10) / 10;

    const totalApprovedRecords = 
      db.projects.filter(p => p.verificationStatus === 'approved').length +
      db.publications.filter(p => p.verificationStatus === 'approved').length +
      db.patents.filter(p => p.verificationStatus === 'approved').length +
      db.grants.filter(p => p.verificationStatus === 'approved').length +
      db.startups.filter(p => p.verificationStatus === 'approved').length +
      db.competitions.filter(p => p.verificationStatus === 'approved').length +
      db.awards.filter(p => p.verificationStatus === 'approved').length +
      db.events.filter(p => p.verificationStatus === 'approved').length;

    return {
      overallScore: Math.min(100, overallScore),
      totalIndicators: activeIndicators.length,
      totalApprovedRecords,
      results,
      lastCalculatedAt: new Date().toISOString()
    };
  }
}
