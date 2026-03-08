// Pure Canvas Chart Rendering for CVMS
// No external libraries - pure JavaScript canvas implementation

class SimpleChart {
  constructor(canvasId, data, type = 'pie', options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id '${canvasId}' not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.data = data;
    this.type = type;
    this.options = {
      colors: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'],
      showLabels: true,
      showValues: true,
      ...options
    };

    // Set canvas size
    this.resizeCanvas();
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  drawPieChart() {
    const total = this.data.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total === 0) return;

    let currentAngle = -Math.PI / 2;
    const centerX = this.canvas.width / (2 * window.devicePixelRatio);
    const centerY = this.canvas.height / (2 * window.devicePixelRatio);
    const radius = Math.min(centerX, centerY) * 0.8;

    this.data.forEach((item, index) => {
      if (!item.value || item.value <= 0) return;

      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = this.options.colors[index % this.options.colors.length];

      // Draw slice
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw label
      if (this.options.showLabels) {
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 1.2;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;

        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = '14px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const percentage = Math.round((item.value / total) * 100);
        const labelText = this.options.showValues ?
          `${item.label}: ${item.value} (${percentage}%)` :
          `${item.label} (${percentage}%)`;

        this.ctx.fillText(labelText, labelX, labelY);
      }

      currentAngle += sliceAngle;
    });
  }

  drawBarChart() {
    const maxValue = Math.max(...this.data.map(d => d.value || 0));
    if (maxValue === 0) return;

    const padding = 60;
    const chartWidth = this.canvas.width / window.devicePixelRatio - (padding * 2);
    const chartHeight = this.canvas.height / window.devicePixelRatio - (padding * 2);
    const barWidth = chartWidth / this.data.length * 0.8;
    const barSpacing = chartWidth / this.data.length * 0.2;

    this.data.forEach((item, index) => {
      if (!item.value || item.value <= 0) return;

      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing);
      const y = padding + chartHeight - barHeight;

      const color = this.options.colors[index % this.options.colors.length];

      // Draw bar
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, barWidth, barHeight);

      // Draw border
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      if (this.options.showValues) {
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
      }

      // Draw label below bar
      if (this.options.showLabels) {
        this.ctx.fillStyle = '#6B7280';
        this.ctx.font = '12px Inter';
        this.ctx.fillText(item.label, x + barWidth / 2, padding + chartHeight + 20);
      }
    });

    // Draw axes
    this.ctx.strokeStyle = '#E5E7EB';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, padding + chartHeight);
    this.ctx.lineTo(padding + chartWidth, padding + chartHeight);
    this.ctx.stroke();
  }

  drawLineChart() {
    if (this.data.length < 2) return;

    const padding = 60;
    const chartWidth = this.canvas.width / window.devicePixelRatio - (padding * 2);
    const chartHeight = this.canvas.height / window.devicePixelRatio - (padding * 2);
    const maxValue = Math.max(...this.data.map(d => d.value || 0));
    const pointSpacing = chartWidth / (this.data.length - 1);

    this.ctx.strokeStyle = this.options.colors[0];
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Draw line
    this.ctx.beginPath();
    this.data.forEach((item, index) => {
      const x = padding + index * pointSpacing;
      const y = padding + chartHeight - (item.value / maxValue) * chartHeight;

      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      // Draw point
      this.ctx.fillStyle = this.options.colors[0];
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();

      // Draw value
      if (this.options.showValues) {
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(item.value.toString(), x, y - 15);
      }
    });
    this.ctx.stroke();

    // Draw labels
    if (this.options.showLabels) {
      this.data.forEach((item, index) => {
        const x = padding + index * pointSpacing;
        this.ctx.fillStyle = '#6B7280';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(item.label, x, padding + chartHeight + 20);
      });
    }
  }

  drawDoughnutChart() {
    const total = this.data.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total === 0) return;

    let currentAngle = -Math.PI / 2;
    const centerX = this.canvas.width / (2 * window.devicePixelRatio);
    const centerY = this.canvas.height / (2 * window.devicePixelRatio);
    const outerRadius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = outerRadius * 0.6;

    this.data.forEach((item, index) => {
      if (!item.value || item.value <= 0) return;

      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = this.options.colors[index % this.options.colors.length];

      // Draw slice
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Draw center circle
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    this.ctx.fill();

    // Draw total in center
    this.ctx.fillStyle = '#1F2937';
    this.ctx.font = 'bold 16px Inter';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(total.toString(), centerX, centerY - 5);

    this.ctx.font = '12px Inter';
    this.ctx.fillText('Total', centerX, centerY + 10);
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set background
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);

    // Draw chart based on type
    switch (this.type) {
      case 'pie':
        this.drawPieChart();
        break;
      case 'bar':
        this.drawBarChart();
        break;
      case 'line':
        this.drawLineChart();
        break;
      case 'doughnut':
        this.drawDoughnutChart();
        break;
      default:
        this.drawPieChart();
    }
  }

  // Update data and re-render
  updateData(newData) {
    this.data = newData;
    this.render();
  }

  // Export as image
  exportAsImage(filename = 'chart.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

// Utility function to create charts easily
function createChart(canvasId, data, type = 'pie', options = {}) {
  const chart = new SimpleChart(canvasId, data, type, options);
  chart.render();
  return chart;
}

// Export for global use
window.Chart = SimpleChart;
window.createChart = createChart;