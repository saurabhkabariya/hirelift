import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = 'https://www.hirelift.tech';
  const currentDate = new Date().toISOString();
  
  // Sample job data - in a real application, you'd fetch this from your database
  const sampleJobs = [
    {
      id: "1",
      title: "Senior React Developer",
      company: "TechCorp India",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      description: "Join our team as a Senior React Developer and build amazing user experiences.",
      publishDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      salary: "₹15-20 LPA"
    },
    {
      id: "2", 
      title: "Data Scientist",
      company: "AI Innovations",
      location: "Bangalore, Karnataka",
      type: "Full-time",
      description: "Work on cutting-edge machine learning projects and help drive business insights.",
      publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      salary: "₹18-25 LPA"
    },
    {
      id: "3",
      title: "Digital Marketing Manager",
      company: "Growth Marketing Co",
      location: "Delhi, NCR",
      type: "Full-time",
      description: "Lead our digital marketing efforts and drive customer acquisition strategies.",
      publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      salary: "₹12-18 LPA"
    },
    {
      id: "4",
      title: "UI/UX Designer",
      company: "Design Studios",
      location: "Chennai, Tamil Nadu",
      type: "Full-time",
      description: "Create beautiful and intuitive user interfaces for web and mobile applications.",
      publishDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      salary: "₹10-15 LPA"
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Hyderabad, Telangana",
      type: "Full-time",
      description: "Manage cloud infrastructure and implement CI/CD pipelines for our applications.",
      publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      salary: "₹16-22 LPA"
    }
  ];

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HireLift - Latest Jobs in India</title>
    <link>${baseUrl}/jobs</link>
    <description>Latest job opportunities in India across all industries. Find your dream job with HireLift.</description>
    <language>en-IN</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/jobs/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>HireLift Jobs</title>
      <link>${baseUrl}/jobs</link>
    </image>
    ${sampleJobs.map(job => `
    <item>
      <title><![CDATA[${job.title} at ${job.company}]]></title>
      <link>${baseUrl}/jobs/${job.id}</link>
      <description><![CDATA[
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Type:</strong> ${job.type}</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
        <p><strong>Description:</strong> ${job.description}</p>
        <p><a href="${baseUrl}/jobs/${job.id}">Apply Now →</a></p>
      ]]></description>
      <pubDate>${new Date(job.publishDate).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/jobs/${job.id}</guid>
      <category>Jobs</category>
      <category>${job.type}</category>
      <category>${job.location}</category>
    </item>`).join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    },
  });
}