"""
Initial migration for Student model.
"""

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(
                    help_text='Full name of the student',
                    max_length=255
                )),
                ('email', models.EmailField(
                    help_text='Unique email address of the student',
                    max_length=254,
                    unique=True
                )),
                ('phone', models.CharField(
                    help_text='Contact phone number (7-15 digits)',
                    max_length=20,
                    validators=[django.core.validators.RegexValidator(
                        message="Phone number must be between 7-15 digits and may start with '+'.",
                        regex='^\\+?1?\\d{7,15}$'
                    )]
                )),
                ('department', models.CharField(
                    help_text='Academic department of the student',
                    max_length=100
                )),
                ('year', models.IntegerField(
                    help_text='Current academic year (1-6)',
                    validators=[
                        django.core.validators.MinValueValidator(
                            1, message='Year must be at least 1.'
                        ),
                        django.core.validators.MaxValueValidator(
                            6, message='Year must be at most 6.'
                        )
                    ]
                )),
                ('created_at', models.DateTimeField(
                    auto_now_add=True,
                    help_text='Timestamp when the record was created'
                )),
                ('updated_at', models.DateTimeField(
                    auto_now=True,
                    help_text='Timestamp when the record was last updated'
                )),
            ],
            options={
                'verbose_name': 'Student',
                'verbose_name_plural': 'Students',
                'db_table': 'students',
                'ordering': ['-created_at'],
            },
        ),
    ]
