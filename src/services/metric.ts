import prisma from '../lib/prisma.js';

export async function recomputeMetrics() {
  const [
    totalMentors,
    totalInstitutes,
    totalCourses,
    totalWorkshops,
    contentHours,
    cities,
    states,
  ] = await prisma.$transaction([
    prisma.mentor.count(),
    prisma.institution.count(),
    prisma.course.count(),
    prisma.workshop.count(),
    prisma.course.aggregate({
      _sum: { commitmentHours: true },
    }),
    prisma.institution.findMany({
      distinct: ['city'],
      select: { city: true },
    }),
    prisma.institution.findMany({
      distinct: ['state'],
      select: { state: true },
    }),
  ]);

  return prisma.metrics.upsert({
    where: { id: 'singleton' },
    update: {
      total_mentors: totalMentors,
      total_institutes: totalInstitutes,
      total_courses: totalCourses,
      total_workshops: totalWorkshops,
      total_cities: cities.length,
      total_states: states.length,
      total_content_hours: contentHours._sum.commitmentHours ?? 0,
    },
    create: {
      id: 'singleton',
      total_students: 1000,
      total_projects: 20,
      total_mentors: totalMentors,
      total_institutes: totalInstitutes,
      total_courses: totalCourses,
      total_workshops: totalWorkshops,
      total_cities: cities.length,
      total_states: states.length,
      total_content_hours: contentHours._sum.commitmentHours ?? 0,
    },
  });
}
