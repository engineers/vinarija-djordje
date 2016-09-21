CREATE TABLE [dbo].[Gallery] (
    [Id]        INT            IDENTITY (1, 1) NOT NULL,
    [FilePath]  NVARCHAR (100) NOT NULL,
    [SortOrder] INT            NOT NULL,
    CONSTRAINT [PK_Gallery] PRIMARY KEY CLUSTERED ([Id] ASC)
);

