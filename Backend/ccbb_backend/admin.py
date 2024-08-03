from django.contrib import admin
from .models import *

admin.site.register(Warehouse)
admin.site.register(Cycle)
admin.site.register(PastCycle)
admin.site.register(PhysicallyMissingPart)
admin.site.register(SystematicallyMissingPart)
admin.site.register(Transaction)
admin.site.register(Bin)
admin.site.register(PresentPart)
admin.site.register(SystemPart)
