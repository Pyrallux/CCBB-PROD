# Generated by Django 5.0.1 on 2024-01-13 20:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ccbb_backend', '0009_rename_presentpart_id_presentpart_presentpart_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='presentpart',
            old_name='presentPart_id',
            new_name='present_part_id',
        ),
        migrations.RenameField(
            model_name='systempart',
            old_name='systemPart_id',
            new_name='system_part_id',
        ),
        migrations.AddField(
            model_name='warehouse',
            name='abc_code_path',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='warehouse',
            name='cycles_per_year',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AddField(
            model_name='warehouse',
            name='path',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.CreateModel(
            name='PhysicallyMissingPart',
            fields=[
                ('physically_missing_part_id', models.AutoField(primary_key=True, serialize=False)),
                ('number', models.CharField(max_length=100)),
                ('quantity', models.FloatField()),
                ('location', models.CharField(max_length=100)),
                ('date', models.DateField()),
                ('warehouse_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ccbb_backend.warehouse')),
            ],
        ),
        migrations.CreateModel(
            name='SystematicallyMissingPart',
            fields=[
                ('systematically_missing_part_id', models.AutoField(primary_key=True, serialize=False)),
                ('number', models.CharField(max_length=100)),
                ('quantity', models.FloatField()),
                ('location', models.CharField(max_length=100)),
                ('date', models.DateField()),
                ('warehouse_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ccbb_backend.warehouse')),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('transaction_id', models.AutoField(primary_key=True, serialize=False)),
                ('part_number', models.CharField(max_length=100)),
                ('old_location', models.CharField(max_length=100)),
                ('new_location', models.CharField(max_length=100)),
                ('quantity', models.FloatField()),
                ('date', models.DateField()),
                ('warehouse_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ccbb_backend.warehouse')),
            ],
        ),
    ]
