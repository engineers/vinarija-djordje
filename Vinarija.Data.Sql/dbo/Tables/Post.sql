CREATE TABLE [dbo].[Post] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Title]       NVARCHAR (100) NOT NULL,
    [Content]     NVARCHAR (MAX) NOT NULL,
    [Date]        DATETIME       NOT NULL,
    [DateCreated] DATETIME       NOT NULL,
    [Active]      BIT            NOT NULL,
    CONSTRAINT [PK_Blog] PRIMARY KEY CLUSTERED ([Id] ASC)
);

