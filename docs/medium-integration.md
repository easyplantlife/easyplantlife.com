# Medium Integration Technical Specification

## Overview

This document describes the approach for integrating Medium blog posts into the Easy Plant Life website. The website will display excerpts and links to blog posts hosted on Medium, with Medium remaining the canonical source.

## Research Summary

### Available Integration Methods

| Method | Pros | Cons |
|--------|------|------|
| **RSS Feed** | Free, no authentication, reliable | Limited to 10 posts, XML format |
| **Medium API** | N/A | Not available for reading posts |
| **Manual Curation** | Full control | Maintenance burden |
| **Third-party APIs** | JSON format | Dependency, potential costs |

### Chosen Approach: RSS Feed with Server-Side Parsing

**Decision:** Use Medium's native RSS feed parsed server-side in Next.js.

**Rationale:**
1. **Free and reliable** - No third-party dependencies or API keys
2. **No CORS issues** - Server-side fetching bypasses browser restrictions
3. **Sufficient data** - RSS provides title, excerpt, date, link, and content
4. **Aligns with MVP philosophy** - Simplest solution that meets requirements
5. **10 post limit acceptable** - Brand site needs recent posts, not archive

## Technical Specification

### RSS Feed Details

**Feed URL Format:**
```
https://medium.com/feed/@{username}
```

**Example:**
```
https://medium.com/feed/@easyplantlife
```

**Available Fields per Post:**
| Field | RSS Element | Required | Notes |
|-------|-------------|----------|-------|
| Title | `<title>` | Yes | Post headline |
| Link | `<link>` | Yes | Full Medium URL |
| Publication Date | `<pubDate>` | Yes | RFC 822 format |
| Description | `<description>` | Yes | Contains excerpt/summary |
| Content | `<content:encoded>` | No | Full HTML content |
| Author | `<dc:creator>` | No | Author name |
| Categories | `<category>` | No | Tags/topics |
| GUID | `<guid>` | Yes | Unique identifier |
| Thumbnail | `<media:thumbnail>` | No | May not always be present |

### Rate Limits and Restrictions

- **Rate Limits:** No documented rate limits for RSS feeds
- **Update Frequency:** RSS feeds typically update within minutes of new posts
- **Cache Recommendation:** 5-15 minutes to balance freshness and performance
- **Restrictions:** None for public RSS feeds

### Implementation Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Blog Page     │────▶│  Medium Service  │────▶│  Medium RSS     │
│   (SSG/ISR)     │     │  /lib/api/medium │     │  Feed           │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   XML Parser     │
                        │   (xml2js)       │
                        └──────────────────┘
```

### Service Interface

**File:** `/src/lib/api/medium.ts`

```typescript
interface MediumPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  publishedDate: Date;
  thumbnail?: string;
  categories?: string[];
}

interface MediumServiceConfig {
  username: string;
  maxPosts?: number;
}

// Primary function
async function fetchMediumPosts(config: MediumServiceConfig): Promise<MediumPost[]>
```

### Data Flow

1. **Build Time (SSG)** or **Request Time (ISR)**
   - Next.js calls `fetchMediumPosts()` during page generation
   - Service fetches RSS feed from Medium
   - XML is parsed and transformed to `MediumPost[]`
   - Posts are passed to page components

2. **Caching Strategy**
   - Use Next.js ISR (Incremental Static Regeneration)
   - Revalidate every 15 minutes (900 seconds)
   - Fallback to cached content on fetch failures

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Network failure | Return cached posts or empty array with error flag |
| Malformed RSS | Log error, return empty array |
| No posts found | Return empty array (not an error) |
| Parse failure | Log error, skip malformed post |

### Dependencies

**Required:**
- `xml2js` - XML to JavaScript object converter (lightweight, well-maintained)

**Alternative:**
- `rss-parser` - Higher-level RSS parsing library (more abstraction)

**Recommendation:** Use `xml2js` for simplicity and control.

### Environment Variables

```env
# Optional - defaults to @easyplantlife if not set
MEDIUM_USERNAME=easyplantlife

# Optional - for future flexibility
MEDIUM_PUBLICATION_URL=https://medium.com/@easyplantlife
```

### Security Considerations

- **No sensitive data:** RSS feeds are public
- **No user input:** Username is hardcoded/environment variable
- **Content sanitization:** Excerpts displayed as text, not raw HTML
- **External links:** Open in new tab with `rel="noopener noreferrer"`

### Testing Strategy

**Unit Tests:**
- Mock RSS feed responses
- Test XML parsing edge cases
- Test error handling scenarios

**Integration Tests:**
- Test with sample RSS feed fixture
- Verify post transformation

**E2E Tests (optional):**
- Test blog page renders with posts
- Test links open correctly

### Implementation Tasks

Following tasks from SPECS.md:

1. **M7-02:** Create Medium service (`/src/lib/api/medium.ts`)
2. **M7-03:** Define BlogPost TypeScript interface (`/src/lib/types/blog.ts`)
3. **M7-04:** Create BlogPostCard component
4. **M7-05:** Create BlogPostsList component
5. **M7-06:** Assemble Blog page
6. **M7-07:** Write comprehensive tests

### Sample RSS Response Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Easy Plant Life - Medium</title>
    <link>https://medium.com/@easyplantlife</link>
    <description>Latest posts from Easy Plant Life</description>
    <item>
      <title>Post Title Here</title>
      <link>https://medium.com/@easyplantlife/post-slug-123abc</link>
      <guid>https://medium.com/p/123abc</guid>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <description>Post excerpt or summary text...</description>
      <content:encoded><![CDATA[<p>Full HTML content...</p>]]></content:encoded>
      <dc:creator>Easy Plant Life</dc:creator>
      <category>vegan</category>
      <category>lifestyle</category>
    </item>
    <!-- Up to 10 items -->
  </channel>
</rss>
```

## Alternatives Considered

### 1. Third-Party RSS-to-JSON Services

**Examples:** rss2json.com, NoCodeAPI

**Why rejected:**
- Adds external dependency
- Potential costs at scale
- Privacy concerns (requests routed through third party)
- Unnecessary complexity for server-side rendering

### 2. Manual Content Curation

**Why rejected:**
- High maintenance burden
- Delays between Medium post and site update
- Doesn't scale

### 3. Medium API

**Why not applicable:**
- Medium's API is for publishing, not reading posts
- No official read API available

## Future Considerations

- **Full archive:** If more than 10 posts needed, consider caching all posts over time
- **Search/filtering:** Would require storing posts in database
- **Rich content:** If displaying full content on-site, consider content licensing

## Conclusion

The RSS feed approach is the optimal solution for Easy Plant Life's MVP:
- Zero cost
- No external dependencies beyond XML parser
- Reliable and well-documented
- Meets all stated requirements
- Aligns with "calm, minimal" brand philosophy
