from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
import chat_app.urls as chat_app_urls
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chat/', include(chat_app_urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)