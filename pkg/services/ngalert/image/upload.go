package image

import (
	"context"
	"fmt"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"

	"github.com/grafana/grafana/pkg/components/imguploader"
	ngmodels "github.com/grafana/grafana/pkg/services/ngalert/models"
)

// UploadingService uploads images.
type UploadingService struct {
	uploader        imguploader.ImageUploader
	uploadFailures  prometheus.Counter
	uploadSuccesses prometheus.Counter
}

func NewUploadingService(uploader imguploader.ImageUploader, r prometheus.Registerer) *UploadingService {
	return &UploadingService{
		uploader: uploader,
		uploadFailures: promauto.With(r).NewCounter(prometheus.CounterOpts{
			Name:      "image_upload_failures_total",
			Namespace: "grafana",
			Subsystem: "alerting",
		}),
		uploadSuccesses: promauto.With(r).NewCounter(prometheus.CounterOpts{
			Name:      "image_upload_successes_total",
			Namespace: "grafana",
			Subsystem: "alerting",
		}),
	}
}

// Upload uploads an image and returns a new image with the unmodified path and a URL.
// It returns the unmodified screenshot on error.
func (s *UploadingService) Upload(ctx context.Context, image ngmodels.Image) (ngmodels.Image, error) {
	url, err := s.uploader.Upload(ctx, image.Path)
	if err != nil {
		defer s.uploadFailures.Inc()
		return image, fmt.Errorf("failed to upload screenshot: %w", err)
	}
	image.URL = url
	defer s.uploadSuccesses.Inc()
	return image, nil
}
