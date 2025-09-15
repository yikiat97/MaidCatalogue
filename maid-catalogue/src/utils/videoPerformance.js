/**
 * Video Performance Monitoring Utilities
 * Tracks video loading performance and Core Web Vitals impact
 */

class VideoPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Set();
  }

  /**
   * Start monitoring a video element
   */
  startMonitoring(videoElement, videoId) {
    const startTime = performance.now();
    const metric = {
      id: videoId,
      element: videoElement,
      startTime,
      loadTime: null,
      firstFrame: null,
      errors: [],
      bandwidth: this.estimateBandwidth(),
      fileSize: null
    };

    this.metrics.set(videoId, metric);

    // Add event listeners
    const onLoadStart = () => {
      metric.loadStartTime = performance.now();
      console.log(`📹 Video ${videoId}: Load started`);
    };

    const onCanPlayThrough = () => {
      metric.loadTime = performance.now() - startTime;
      console.log(`📹 Video ${videoId}: Loaded in ${metric.loadTime.toFixed(2)}ms`);
      this.logPerformanceMetric(videoId, 'load_time', metric.loadTime);
    };

    const onLoadedMetadata = () => {
      metric.metadataTime = performance.now() - startTime;
      console.log(`📹 Video ${videoId}: Metadata loaded in ${metric.metadataTime.toFixed(2)}ms`);
    };

    const onError = (e) => {
      const error = {
        timestamp: performance.now(),
        error: e.target.error,
        message: e.target.error?.message || 'Unknown video error'
      };
      metric.errors.push(error);
      console.warn(`📹 Video ${videoId}: Error -`, error.message);
      this.logPerformanceMetric(videoId, 'error', error.message);
    };

    const onProgress = () => {
      if (videoElement.buffered.length > 0) {
        const buffered = videoElement.buffered.end(0);
        const duration = videoElement.duration;
        const bufferPercent = (buffered / duration) * 100;
        
        if (bufferPercent > 25 && !metric.quarterBuffered) {
          metric.quarterBuffered = performance.now() - startTime;
          console.log(`📹 Video ${videoId}: 25% buffered in ${metric.quarterBuffered.toFixed(2)}ms`);
        }
      }
    };

    // Attach listeners
    videoElement.addEventListener('loadstart', onLoadStart);
    videoElement.addEventListener('canplaythrough', onCanPlayThrough);
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    videoElement.addEventListener('error', onError);
    videoElement.addEventListener('progress', onProgress);

    // Store cleanup function
    metric.cleanup = () => {
      videoElement.removeEventListener('loadstart', onLoadStart);
      videoElement.removeEventListener('canplaythrough', onCanPlayThrough);
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoElement.removeEventListener('error', onError);
      videoElement.removeEventListener('progress', onProgress);
    };

    return metric;
  }

  /**
   * Stop monitoring a video
   */
  stopMonitoring(videoId) {
    const metric = this.metrics.get(videoId);
    if (metric && metric.cleanup) {
      metric.cleanup();
      this.metrics.delete(videoId);
    }
  }

  /**
   * Get performance summary for a video
   */
  getPerformanceReport(videoId) {
    const metric = this.metrics.get(videoId);
    if (!metric) return null;

    return {
      id: videoId,
      loadTime: metric.loadTime,
      metadataTime: metric.metadataTime,
      quarterBuffered: metric.quarterBuffered,
      errors: metric.errors.length,
      bandwidth: metric.bandwidth,
      recommendations: this.generateRecommendations(metric)
    };
  }

  /**
   * Get all performance reports
   */
  getAllReports() {
    const reports = [];
    this.metrics.forEach((metric, id) => {
      reports.push(this.getPerformanceReport(id));
    });
    return reports;
  }

  /**
   * Estimate user's bandwidth
   */
  estimateBandwidth() {
    if (navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      };
    }
    return { effectiveType: 'unknown' };
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations(metric) {
    const recommendations = [];

    if (metric.loadTime > 5000) {
      recommendations.push({
        type: 'warning',
        message: 'Video load time is slow (>5s). Consider reducing file size or using adaptive streaming.'
      });
    }

    if (metric.errors.length > 0) {
      recommendations.push({
        type: 'error',
        message: `${metric.errors.length} video errors occurred. Check format compatibility.`
      });
    }

    if (metric.bandwidth?.effectiveType === 'slow-2g' || metric.bandwidth?.effectiveType === '2g') {
      recommendations.push({
        type: 'info',
        message: 'User on slow connection. Serve lower quality or disable autoplay.'
      });
    }

    return recommendations;
  }

  /**
   * Log performance metrics (can be sent to analytics)
   */
  logPerformanceMetric(videoId, metric, value) {
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'video_performance', {
        video_id: videoId,
        metric_type: metric,
        metric_value: value
      });
    }

    // Console log for development
    console.log(`📊 Video Performance [${videoId}] ${metric}:`, value);
  }

  /**
   * Monitor Core Web Vitals impact
   */
  monitorCoreWebVitals() {
    if ('web-vital' in window) {
      // This would integrate with web-vitals library if available
      console.log('📊 Core Web Vitals monitoring enabled');
    }
  }

  /**
   * Generate performance summary for debugging
   */
  getDebugSummary() {
    const summary = {
      totalVideos: this.metrics.size,
      reports: this.getAllReports(),
      timestamp: new Date().toISOString()
    };

    console.group('📊 Video Performance Summary');
    console.log('Total videos monitored:', summary.totalVideos);
    summary.reports.forEach(report => {
      if (report) {
        console.group(`📹 ${report.id}`);
        console.log('Load time:', report.loadTime ? `${report.loadTime.toFixed(2)}ms` : 'Not loaded');
        console.log('Errors:', report.errors);
        console.log('Bandwidth:', report.bandwidth?.effectiveType || 'Unknown');
        report.recommendations.forEach(rec => {
          console.log(`${rec.type.toUpperCase()}:`, rec.message);
        });
        console.groupEnd();
      }
    });
    console.groupEnd();

    return summary;
  }
}

// Create global instance
export const videoPerformanceMonitor = new VideoPerformanceMonitor();

// Auto-start monitoring Core Web Vitals
if (typeof window !== 'undefined') {
  videoPerformanceMonitor.monitorCoreWebVitals();
}

export default VideoPerformanceMonitor;